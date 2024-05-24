import { ref } from "vue";
import { createBlock } from "./utils/block";
import { createArrow } from "./utils/arrow";
import { createCircle } from "./utils/circle";

export const useElements = (pressedKeys) => {
  const elements = ref([
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
  ]);

  const createInitialBlock = (clientX, clientY) => {
    elements.value.push(
      createBlock(null, clientX, clientY, clientX, clientY, null, null)
    );
  };

  const resizeBlock = (clientX, clientY, block) => {
    const blockCopy = { ...block };

    elements.value = elements.value.filter((el) => el.id !== block.id);

    if (blockCopy.blockId.split(" ").length > 1) {
      elements.value.unshift(
        createBlock(
          blockCopy.id,
          blockCopy.points.x1,
          blockCopy.points.y1,
          clientX,
          clientY,
          blockCopy.text,
          blockCopy.blockId
        )
      );
    } else {
      elements.value.push(
        createBlock(
          blockCopy.id,
          blockCopy.points.x1,
          blockCopy.points.y1,
          clientX,
          clientY,
          blockCopy.text,
          blockCopy.blockId
        )
      );
    }
  };

  const resizeInitialBlock = (clientX, clientY) => {
    resizeBlock(clientX, clientY, elements.value[elements.value.length - 1]);
  };

  const applyFinalChangesToBlock = (initialBlock) => {
    const blockCopy = {
      ...elements.value.find((el) => el.id === initialBlock.id),
    };

    const minX = Math.min(blockCopy.points.x1, blockCopy.points.x2);
    const maxX = Math.max(blockCopy.points.x1, blockCopy.points.x2);
    const minY = Math.min(blockCopy.points.y1, blockCopy.points.y2);
    const maxY = Math.max(blockCopy.points.y1, blockCopy.points.y2);

    elements.value = elements.value.filter((el) => el.id !== blockCopy.id);

    if (blockCopy.blockId.split(" ").length > 1) {
      elements.value.unshift(
        createBlock(
          blockCopy.id,
          minX,
          minY,
          maxX,
          maxY,
          blockCopy.text,
          blockCopy.blockId
        )
      );
    } else {
      elements.value.push(
        createBlock(
          blockCopy.id,
          minX,
          minY,
          maxX,
          maxY,
          blockCopy.text,
          blockCopy.blockId
        )
      );
    }
  };

  const createInitialArrow = (clientX, clientY) => {
    elements.value.push(
      createArrow(
        null,
        [
          { x: clientX, y: clientY },
          { x: clientX, y: clientY },
        ],
        null
      )
    );
  };

  const resizeArrow = (clientX, clientY, arrow) => {
    const arrowCopy = { ...arrow };

    elements.value = elements.value.filter((el) => el.id !== arrow.id);

    const { x, y } = arrowCopy.points[0];

    const perpendicularPoints = [
      { x: x, y: y },
      { x: clientX, y: clientY },
    ];

    if (pressedKeys.value.has("Shift")) {
      if (
        Math.abs(perpendicularPoints[1].y - perpendicularPoints[0].y) >
        Math.abs(perpendicularPoints[1].x - perpendicularPoints[0].x)
      ) {
        perpendicularPoints[1].x = perpendicularPoints[0].x;
      } else {
        perpendicularPoints[1].y = perpendicularPoints[0].y;
      }

      elements.value.push(
        createArrow(
          arrowCopy.id,
          [
            { x: perpendicularPoints[0].x, y: perpendicularPoints[0].y },
            { x: perpendicularPoints[1].x, y: perpendicularPoints[1].y },
          ],
          arrowCopy.text
        )
      );
    } else {
      if (
        Math.abs(perpendicularPoints[1].y - perpendicularPoints[0].y) >
        Math.abs(perpendicularPoints[1].x - perpendicularPoints[0].x)
      ) {
        elements.value.push(
          createArrow(
            arrowCopy.id,
            [
              { x: perpendicularPoints[0].x, y: perpendicularPoints[0].y },
              { x: perpendicularPoints[0].x, y: clientY },
              { x: clientX, y: clientY },
            ],
            arrowCopy.text
          )
        );
      } else {
        elements.value.push(
          createArrow(
            arrowCopy.id,
            [
              { x: perpendicularPoints[0].x, y: perpendicularPoints[0].y },
              { x: clientX, y: perpendicularPoints[0].y },
              { x: clientX, y: clientY },
            ],
            arrowCopy.text
          )
        );
      }
    }
  };

  const resizeInitialArrow = (clientX, clientY) => {
    resizeArrow(clientX, clientY, elements.value[elements.value.length - 1]);
  };

  const createInitialCircle = (clientX, clientY) => {
    elements.value.push(createCircle(null, { x: clientX, y: clientY }));
  };

  return {
    elements,
    createInitialBlock,
    resizeBlock,
    resizeInitialBlock,
    applyFinalChangesToBlock,
    createInitialArrow,
    resizeArrow,
    resizeInitialArrow,
    createInitialCircle,
  };
};
