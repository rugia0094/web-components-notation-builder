import { getElementAtMousePosition } from "../scheme-canvas/utils/mouse";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 *
 * @param {{ name: string, id: string, children: { name: string, id: string, }[], relations: { type: string, name: string, from: string, to: string }[] }} component
 */
const createComponentFile = (component) => {
  const refsString = component.relations
    .filter((r) => r.from === component.id)
    .filter((r) => component.children.find((c) => c.id === r.to))
    .map((ref) => {
      return `
const ${ref.name} = ref(null);
      `;
    })
    .join("");

  const handlersString = Array.from(
    new Set(
      component.relations
        .filter((r) => r.to === component.id)
        .filter((r) => component.children.find((c) => c.id === r.from))
        .map((ref) => {
          return `
const handle${
            component.children.find((c) => c.id === ref.from).name
          }${capitalize(ref.name)} = () => {};
      `;
        })
    )
  ).join("");

  const childrenTemplate = component.children
    .map((child) => {
      const propsString = component.relations
        .filter((r) => r.to === child.id)
        .map((r) => ":" + r.name + "=" + '"' + r.name + '"')
        .join(" ");

      const eventsString = component.relations
        .filter((r) => r.from === child.id)
        .map(
          (r) =>
            "@" +
            r.name +
            "=" +
            '"' +
            "handle" +
            child.name +
            capitalize(r.name) +
            '"'
        )
        .join(" ");

      return `
      <${child.name} ${propsString} ${eventsString} />
    `;
    })
    .join("");

  const propsString = component.relations
    .filter((r) => r.from === component.parentId)
    .map((prop) => '"' + prop.name + '"')
    .join(",");

  const emitsString = component.relations
    .filter((r) => r.to === component.parentId)
    .map((prop) => '"' + prop.name + '"')
    .join(",");

  return `
<script setup>
import { ref } from "vue";

const props = defineProps([${propsString}]);
const emit = defineEmits([${emitsString}]);
${refsString}
${handlersString}
</script>
<template>
  <div>
    <div>${component.name}</div>
    <div>
${childrenTemplate}
    </div>
  </div>
</template>
  `;
};

const downloadVueFile = (text, fileName) => {
  const blob = new Blob([text], {
    type: "text/plain",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.vue`;

  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

const recursivelyDownloadComponents = (component) => {
  downloadVueFile(createComponentFile(component), component.name);

  component.children.forEach((child) => recursivelyDownloadComponents(child));
};

const blockInDiagram = (block, diagram) =>
  block.points.x1 > diagram.points.x1 &&
  block.points.y1 > diagram.points.y1 &&
  block.points.x2 < diagram.points.x2 &&
  block.points.y2 < diagram.points.y2;

const circleInDiagram = (circle, diagram) =>
  circle.center.x > diagram.points.x1 &&
  circle.center.y > diagram.points.y1 &&
  circle.center.x < diagram.points.x2 &&
  circle.center.y < diagram.points.y2;

const arrowInDiagram = (arrow, diagram) =>
  arrow.points.every(
    (point) =>
      point.x > diagram.points.x1 &&
      point.y > diagram.points.y1 &&
      point.x < diagram.points.x2 &&
      point.y < diagram.points.y2
  );

const diagramForBlock = (block, diagrams) =>
  diagrams.find((d) => d.blockId.split(" ")[0] === block.blockId);

const recursiveAlgo = (
  diagram,
  allDiagrams,
  allBlocks,
  allCircles,
  allArrows,
  parentId
) => {
  const result = {
    name: diagram.blockId.split(" ")[1],
    id: diagram.blockId.split(" ")[0],
    parentId: parentId,
    children: [],
    relations: [],
  };

  const blocksInDiagram = allBlocks.filter((block) =>
    blockInDiagram(block, diagram)
  );

  const circlesInDiagram = allCircles.filter((circle) =>
    circleInDiagram(circle, diagram)
  );

  const arrowsInDiagram = allArrows.filter((arrow) =>
    arrowInDiagram(arrow, diagram)
  );

  arrowsInDiagram.forEach((arrow) => {
    const arrowBeginPoint = arrow.points[0];
    const arrowEndPoint = arrow.points[arrow.points.length - 1];

    const elementAtBegin =
      getElementAtMousePosition(arrowBeginPoint.x, arrowBeginPoint.y, [
        ...circlesInDiagram,
        ...blocksInDiagram,
      ]) ?? diagram;

    const elementAtEnd =
      getElementAtMousePosition(arrowEndPoint.x, arrowEndPoint.y, [
        ...circlesInDiagram,
        ...blocksInDiagram,
      ]) ?? diagram;

    if (elementAtBegin.type === "CIRCLE") {
      // Из внутреннего состояния

      if (elementAtEnd.type === "BLOCK") {
        // Свойство в блок

        result.relations.push({
          type: "PROP",
          name: arrow.text.slice(1),
          from: result.id,
          to: elementAtEnd.blockId,
        });
      }

      if (elementAtEnd.type === "DIAGRAM") {
        // Событие наружу

        result.relations.push({
          type: "EVENT",
          name: arrow.text.slice(1),
          from: result.id,
          to: parentId,
        });
      }
    }

    if (elementAtBegin.type === "BLOCK") {
      // Из блока

      if (elementAtEnd.type === "CIRCLE") {
        // Событие в внутренее состояние

        result.relations.push({
          type: "EVENT",
          name: arrow.text.slice(1),
          from: elementAtBegin.blockId,
          to: result.id,
        });
      }

      if (elementAtEnd.type === "DIAGRAM") {
        // Событие наружу

        result.relations.push({
          type: "EVENT",
          name: arrow.text.slice(1),
          from: elementAtBegin.blockId,
          to: parentId,
        });
      }
    }

    if (elementAtBegin.type === "DIAGRAM") {
      // Снаружи

      if (elementAtEnd.type === "CIRCLE") {
        // Свойство в внутренее состояние

        result.relations.push({
          type: "PROP",
          name: arrow.text.slice(1),
          from: parentId,
          to: result.id,
        });
      }

      if (elementAtEnd.type === "BLOCK") {
        // Свойство в блок

        result.relations.push({
          type: "PROP",
          name: arrow.text.slice(1),
          from: parentId,
          to: elementAtEnd.blockId,
        });
      }
    }
  });

  blocksInDiagram.forEach((block) => {
    const blockDiagram = diagramForBlock(block, allDiagrams);

    if (blockDiagram) {
      result.children.push(
        recursiveAlgo(
          blockDiagram,
          allDiagrams,
          allBlocks,
          allCircles,
          allArrows,
          result.id
        )
      );
    } else {
      result.children.push({
        name: block.text,
        id: block.blockId,
        parentId: result.id,
        children: [],
        relations: [],
      });
    }
  });

  return result;
};

export const getComponentHierarcyFromElements = (elements) => {
  elements
    .filter((el) => el.blockId)
    .filter((el) => el.blockId.split(" ").length === 2)
    .forEach((el) => {
      el.type = "DIAGRAM";
    });

  console.log(
    "1. All BLocks and Diagrams",
    elements.filter((el) => el.blockId)
  );

  const diagrams = elements.filter((el) => el.type === "DIAGRAM");

  console.log("2. All Diagrams", diagrams);

  const blocks = elements.filter((el) => el.type === "BLOCK");

  console.log("3. All Blocks", blocks);

  const circles = elements.filter((el) => el.type === "CIRCLE");

  console.log("4. All Circles", circles);

  const arrows = elements.filter((el) => el.type === "ARROW");

  console.log("5. All Arrows", arrows);

  const componentHierarcy = recursiveAlgo(
    diagrams[0],
    diagrams,
    blocks,
    circles,
    arrows,
    0
  );

  recursivelyDownloadComponents(componentHierarcy);
};

const example = [
  {
    id: 522241,
    type: "BLOCK",
    blockId: "1 App",
    text: "EMPTY",
    points: {
      x1: 46.14699331848555,
      y1: 69.06681514476591,
      x2: 1393.58574610245,
      y2: 966.6169265033404,
    },
  },
  {
    id: 472034,
    type: "BLOCK",
    blockId: "2",
    text: "UserCard",
    points: {
      x1: 548.3741648106904,
      y1: 162.60801781737172,
      x2: 900.2672605790646,
      y2: 377.53006681514455,
    },
  },
  {
    id: 379380,
    type: "BLOCK",
    blockId: "3",
    text: "BaseButton",
    points: {
      x1: 548.3741648106903,
      y1: 429.86859688195966,
      x2: 894.6993318485524,
      y2: 614.7238307349662,
    },
  },
  {
    id: 838452,
    type: "BLOCK",
    blockId: "4",
    text: "BaseButton",
    points: {
      x1: 547.260579064588,
      y1: 670.4031180400887,
      x2: 900.2672605790648,
      y2: 866.3942093541199,
    },
  },
  {
    id: 895260,
    type: "CIRCLE",
    center: {
      x: 341.2472160356348,
      y: 332.98663697104655,
    },
  },
  {
    id: 65001,
    type: "CIRCLE",
    center: {
      x: 335.67928730512256,
      y: 217.17371937639172,
    },
  },
  {
    id: 881606,
    type: "CIRCLE",
    center: {
      x: 341.24721603563484,
      y: 520.0690423162581,
    },
  },
  {
    id: 17843,
    type: "CIRCLE",
    center: {
      x: 342.3608017817373,
      y: 773.9665924276165,
    },
  },
  {
    id: 60309,
    type: "CIRCLE",
    center: {
      x: 1090.6904231625836,
      y: 771.7394209354117,
    },
  },
  {
    id: 641446,
    type: "CIRCLE",
    center: {
      x: 1086.2360801781738,
      y: 523.4097995545654,
    },
  },
  {
    id: 457961,
    type: "CIRCLE",
    center: {
      x: 1084.008908685969,
      y: 273.9665924276168,
    },
  },
  {
    id: 87510,
    type: "ARROW",
    points: [
      {
        x: 365.0467706013369,
        y: 774.634743875278,
      },
      {
        x: 542.1069042316258,
        y: 774.634743875278,
      },
    ],
    text: ":text",
  },
  {
    id: 650548,
    type: "ARROW",
    points: [
      {
        x: 366.85968819599117,
        y: 520.0690423162581,
      },
      {
        x: 540.5790645879733,
        y: 520.0690423162581,
      },
    ],
    text: ":Text",
    blockId: null,
  },
  {
    id: 560366,
    type: "ARROW",
    points: [
      {
        x: 896.9265033407572,
        y: 530.0913140311801,
      },
      {
        x: 1056.1692650334076,
        y: 530.0913140311801,
      },
    ],
    text: "@click",
    blockId: null,
  },
  {
    id: 220262,
    type: "ARROW",
    points: [
      {
        x: 901.3808463251671,
        y: 768.3986636971043,
      },
      {
        x: 1059.510022271715,
        y: 768.3986636971043,
      },
    ],
    text: "@click",
    blockId: null,
  },
  {
    id: 811261,
    type: "ARROW",
    points: [
      {
        x: 901.3808463251671,
        y: 275.08017817371916,
      },
      {
        x: 1052.8285077951002,
        y: 275.08017817371916,
      },
    ],
    text: "@userUpdate",
    blockId: null,
  },
  {
    id: 608339,
    type: "ARROW",
    points: [
      {
        x: 366.85968819599117,
        y: 332.98663697104655,
      },
      {
        x: 542.8062360801782,
        y: 332.98663697104655,
      },
    ],
    text: ":userName",
    blockId: null,
  },
  {
    id: 550248,
    type: "ARROW",
    points: [
      {
        x: 362.40534521158133,
        y: 219.40089086859663,
      },
      {
        x: 540.5790645879733,
        y: 219.40089086859663,
      },
    ],
    text: ":authenticated",
    blockId: null,
  },
  {
    id: 853654,
    type: "BLOCK",
    blockId: "2 UserCard",
    text: "EMPTY",
    points: {
      x1: 1649.9665082950385,
      y1: 63.39344964561104,
      x2: 2916.537113482358,
      y2: 971.1744294727004,
    },
  },
  {
    id: 986031,
    type: "BLOCK",
    blockId: "5",
    text: "UserCardHeader",
    points: {
      x1: 2073.597632214347,
      y1: 367.42803177817586,
      x2: 2477.0558454708307,
      y2: 623.9121816340837,
    },
  },
  {
    id: 754059,
    type: "CIRCLE",
    center: {
      x: 1807.0270270270269,
      y: 881.8372536801932,
    },
  },
  {
    id: 908994,
    type: "CIRCLE",
    center: {
      x: 1899.2460471999377,
      y: 563.393449645611,
    },
  },
  {
    id: 904206,
    type: "CIRCLE",
    center: {
      x: 2746.5082950385545,
      y: 125.35310382428538,
    },
  },
  {
    id: 76046,
    type: "ARROW",
    points: [
      {
        x: 1654.2892748656436,
        y: 740.6268790404237,
      },
      {
        x: 1807.0270270270269,
        y: 740.6268790404237,
      },
      {
        x: 1807.0270270270269,
        y: 847.2551211153517,
      },
    ],
    text: ":authenticated",
    blockId: null,
  },
  {
    id: 824537,
    type: "ARROW",
    points: [
      {
        x: 2746.5082950385545,
        y: 148.407858867513,
      },
      {
        x: 2746.5082950385545,
        y: 315.55483293091356,
      },
      {
        x: 2907.891580341148,
        y: 315.55483293091356,
      },
    ],
    text: "@userUpdate",
    blockId: null,
  },
  {
    id: 470712,
    type: "ARROW",
    points: [
      {
        x: 1925.1826466235686,
        y: 560.5116052652075,
      },
      {
        x: 2063.5111768829347,
        y: 560.5116052652075,
      },
    ],
    text: ":theme",
    blockId: null,
  },
  {
    id: 33433,
    type: "ARROW",
    points: [
      {
        x: 1654.2892748656436,
        y: 442.3559856686657,
      },
      {
        x: 2064.9520990731367,
        y: 442.3559856686657,
      },
    ],
    text: ":userName",
    blockId: null,
  },
];

const IDEAL_RESULT = {
  name: "App",
  id: "1",
  children: [
    {
      name: "UserCard",
      id: "2",
      children: [
        {
          name: "UserCardHeader",
          id: "5",
          children: [],
        },
      ],
      relations: [
        {
          type: "PROP",
          name: "authenticated",
          from: "1",
          to: "2",
        },
        {
          type: "EVENT",
          name: "userUpdate",
          from: "2",
          to: "1",
        },
        {
          type: "PROP",
          name: "theme",
          from: "2",
          to: "5",
        },
        {
          type: "PROP",
          name: "userName",
          from: "1",
          to: "5",
        },
      ],
    },
    {
      name: "BaseButton",
      id: "3",
      children: [],
    },
    {
      name: "BaseButton",
      id: "4",
      children: [],
    },
  ],
  relations: [
    {
      type: "PROP",
      name: "text",
      from: "1",
      to: "4",
    },
    {
      type: "PROP",
      name: "Text",
      from: "1",
      to: "3",
    },
    {
      type: "EVENT",
      name: "click",
      from: "3",
      to: "1",
    },
    {
      type: "EVENT",
      name: "click",
      from: "4",
      to: "1",
    },
    {
      type: "EVENT",
      name: "userUpdate",
      from: "2",
      to: "1",
    },
    {
      type: "PROP",
      name: "userName",
      from: "1",
      to: "2",
    },
    {
      type: "PROP",
      name: "authenticated",
      from: "1",
      to: "2",
    },
  ],
};
