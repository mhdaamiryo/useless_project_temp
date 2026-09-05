import { NextRequest, NextResponse } from 'next/server';

export interface PotatoAnalysisResult {
  id: number;
  title: string;
  persona: string;
  irregularity: number;
  roughness: number;
  uniqueness: number;
  dramaScore: number;
  malayalamQuote: string;
  box?: [number, number, number, number];
  cropUrl?: string;
}

const personas = [
  { 
    title: 'The Tragic Hero', 
    quote: 'വിധി എന്നെ വട്ടത്തിൽ വെട്ടിപ്പരുത്തി... പക്ഷേ കറിയിലെത്തുമ്പോൾ ഞാൻ വീണ്ടും ഉദിച്ചുയരും! 😭🌾🔥' 
  },
  { 
    title: 'Quietly Unraveling', 
    quote: 'പുറത്തു ചിരി, ഉള്ളിൽ ഉരുകിത്തീരുന്ന കിഴങ്ങ് കറി! എന്നെ ആരും മനസ്സിലാക്കുന്നില്ലല്ലോ ഭഗവാനേ... 🎭🥔💔' 
  },
  { 
    title: 'The Main Character', 
    quote: 'ബിരിയാണിയിൽ ഞാൻ ഇല്ലായിരിക്കാം, പക്ഷേ സദ്യയുടെ ലൈംലൈറ്റ് എപ്പോഴും എനിക്കാണ്! ആറ്റിറ്റ്യൂഡ് കിങ്! ✨😎🥔' 
  },
  { 
    title: 'Barely Holding On', 
    quote: 'ഒരു തൊലി ഉരിയാൻ കാത്തിരിക്കുന്ന ജീവിതം... എങ്കിലും ഞാൻ പതറില്ല! 🥺🍂🫠' 
  },
  { 
    title: 'Emotionally Stable', 
    quote: 'ചൂടണ്ണെയിൽ വീണാലും മൈൻഡ് ചെയ്യില്ല! ഫുൾ പീസ് & പ്രശാന്തത... 🧘‍♂️✨🌱' 
  },
  { 
    title: 'Underground Legend', 
    quote: 'മണ്ണിനടിയിൽ കിടന്നപ്പോ ആരും നോക്കിയില്ല, പുറത്തെത്തിയപ്പോ എല്ലാവർക്കും ഞാൻ വേണം! ഡോൺ ഫോർ എ റീസൺ! 👑🌱🔥' 
  },
  { 
    title: 'Existential Crisis Mode', 
    quote: 'ഞാൻ ഫ്രെഞ്ച് ഫ്രൈസ് ആകേണ്ടവനോ അതോ സാംബാറിലേക്ക് എറിയപ്പെടേണ്ടവനോ? ബി ഓർ നോട്ട് ടു ബി! 🤔🍂🥔' 
  },
  { 
    title: 'Silent Storm', 
    quote: 'എന്റെ മൗനം നിങ്ങൾ തഴമ്പായി കാണരുത്... കട്ടിങ് ബോർഡിൽ വീഴുമ്പോ ഞാൻ കത്തിക്കയറും! 🌪️🔪🥔' 
  },
  { 
    title: 'Suspicious Spud', 
    quote: 'എന്നെ സംശയിക്കേണ്ട... ഞാനും ഒരു പാവം ഉരുളക്കിഴങ്ങാണ് (പക്ഷേ രഹസ്യങ്ങൾ പലതും അറിയാം)! 🕵️‍♂️🥔👁️' 
  },
  { 
    title: 'Dramatic Villain', 
    quote: 'എല്ലാവരുടെയും റെസിപ്പി തകർക്കാൻ അവതരിച്ച അവതാരം! വിൻസെന്റ് ഗോമസ് സ്റ്റൈൽ! 😈🥔💥' 
  }
];

async function detectPotatoesRoboflow(base64Data: string) {
  const apiKey = process.env.ROBOFLOW_API_KEY || '';
  const response = await fetch(
    `https://serverless.roboflow.com/potato-detection-3et6q/11`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: base64Data,
    }
  );

  if (!response.ok) {
    throw new Error(`Roboflow request failed with status ${response.status}`);
  }

  const data = await response.json();

  // Roboflow returns { predictions: [{ x, y, width, height, confidence, class }], image: { width, height } }
  const predictions = data.predictions || [];

  return {
    detections: predictions.map((p: any) => ({
      label: p.class || 'potato',
      score: p.confidence || 0.9,
      box: {
        xmin: p.x - p.width / 2,
        ymin: p.y - p.height / 2,
        xmax: p.x + p.width / 2,
        ymax: p.y + p.height / 2,
      },
    })),
    imgWidth: data.image?.width,
    imgHeight: data.image?.height,
  };
}

/**
 * Crop a region from a base64 image using pure-JS jimp.
 * Returns a data:image/jpeg;base64,... string.
 */
async function cropImageWithJimp(
  imageBuffer: Buffer,
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  imgWidth: number,
  imgHeight: number,
  padding = 0.12
): Promise<string> {
  const Jimp = require('jimp');

  const padX = Math.floor((xmax - xmin) * padding);
  const padY = Math.floor((ymax - ymin) * padding);

  const left = Math.max(0, Math.floor(xmin) - padX);
  const top = Math.max(0, Math.floor(ymin) - padY);
  const right = Math.min(imgWidth, Math.ceil(xmax) + padX);
  const bottom = Math.min(imgHeight, Math.ceil(ymax) + padY);

  const cropW = right - left;
  const cropH = bottom - top;

  if (cropW <= 0 || cropH <= 0) {
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  }

  const image = await Jimp.read(imageBuffer);
  const cropped = image.crop(left, top, cropW, cropH);
  const croppedBuffer: Buffer = await cropped.getBufferAsync(Jimp.MIME_JPEG);
  return `data:image/jpeg;base64,${croppedBuffer.toString('base64')}`;
}

/** Intersection over Union for two bounding boxes */
function iou(
  a: { xmin: number; ymin: number; xmax: number; ymax: number },
  b: { xmin: number; ymin: number; xmax: number; ymax: number }
): number {
  const interLeft = Math.max(a.xmin, b.xmin);
  const interTop = Math.max(a.ymin, b.ymin);
  const interRight = Math.min(a.xmax, b.xmax);
  const interBottom = Math.min(a.ymax, b.ymax);
  if (interRight <= interLeft || interBottom <= interTop) return 0;
  const interArea = (interRight - interLeft) * (interBottom - interTop);
  const aArea = (a.xmax - a.xmin) * (a.ymax - a.ymin);
  const bArea = (b.xmax - b.xmin) * (b.ymax - b.ymin);
  return interArea / (aArea + bArea - interArea);
}

/** Non-Maximum Suppression: removes boxes that heavily overlap a higher-confidence box */
function applyNMS(detections: any[], iouThreshold = 0.45): any[] {
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const kept: any[] = [];
  for (const det of sorted) {
    const overlaps = kept.some((k) => iou(k.box, det.box) > iouThreshold);
    if (!overlaps) kept.push(det);
  }
  return kept;
}

/** Suppress large container boxes that wrap multiple smaller individual potato boxes */
function suppressContainerBoxes(detections: any[]): any[] {
  const result: any[] = [];
  for (let i = 0; i < detections.length; i++) {
    const boxA = detections[i].box;
    const areaA = (boxA.xmax - boxA.xmin) * (boxA.ymax - boxA.ymin);
    let isContainer = false;

    for (let j = 0; j < detections.length; j++) {
      if (i === j) continue;
      const boxB = detections[j].box;
      const areaB = (boxB.xmax - boxB.xmin) * (boxB.ymax - boxB.ymin);

      const interLeft = Math.max(boxA.xmin, boxB.xmin);
      const interTop = Math.max(boxA.ymin, boxB.ymin);
      const interRight = Math.min(boxA.xmax, boxB.xmax);
      const interBottom = Math.min(boxA.ymax, boxB.ymax);

      if (interRight > interLeft && interBottom > interTop) {
        const interArea = (interRight - interLeft) * (interBottom - interTop);
        if (interArea / areaB > 0.7 && areaA > 1.5 * areaB) {
          isContainer = true;
          break;
        }
      }
    }

    if (!isContainer) {
      result.push(detections[i]);
    }
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing imageBase64 data' }, { status: 400 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Still use Jimp locally to get real dimensions
    const Jimp = require('jimp');
    const jimpImg = await Jimp.read(imageBuffer);
    const imgWidth: number = jimpImg.bitmap.width;
    const imgHeight: number = jimpImg.bitmap.height;

    console.log('Calling Roboflow potato-detection-3et6q/11...');
    let detectedObjects: any[] = [];
    try {
      const { detections } = await detectPotatoesRoboflow(base64Data);
      detectedObjects = detections;
    } catch (err: any) {
      console.warn('Roboflow detection failed or API key missing, falling back:', err.message);
    }

    console.log(`Raw detections from Roboflow: ${detectedObjects.length}`);

    // Filter tiny noise boxes
    const imageArea = imgWidth * imgHeight;
    detectedObjects = detectedObjects.filter((d: any) => {
      const { xmin, ymin, xmax, ymax } = d.box;
      const boxArea = (xmax - xmin) * (ymax - ymin);
      return boxArea / imageArea > 0.005;
    });

    detectedObjects = applyNMS(detectedObjects, 0.45);
    detectedObjects = suppressContainerBoxes(detectedObjects);

    detectedObjects.sort((a: any, b: any) => b.score - a.score);
    if (detectedObjects.length > 10) detectedObjects = detectedObjects.slice(0, 10);

    if (detectedObjects.length === 0) {
      console.log('No objects detected from Roboflow. Falling back to full-image single potato.');
      detectedObjects = [{
        label: 'potato',
        score: 0.99,
        box: { xmin: 0, ymin: 0, xmax: imgWidth, ymax: imgHeight }
      }];
    }

    console.log(`Final potato count for analysis: ${detectedObjects.length}`);

    const results: PotatoAnalysisResult[] = await Promise.all(
      detectedObjects.map(async (obj: any, idx: number) => {
        const personaObj = personas[idx % personas.length];
        const { xmin, ymin, xmax, ymax } = obj.box;
        const boxW = xmax - xmin;
        const boxH = ymax - ymin;

        const aspectRatioDistortion = Math.abs(1 - (boxW / Math.max(boxH, 1)));
        const relativeSize = (boxW * boxH) / imageArea;

        const irregularity = Math.min(99, Math.max(15, Math.floor(aspectRatioDistortion * 80) + 20));
        const roughness = Math.min(99, Math.max(15, Math.floor(obj.score * 100)));
        const uniqueness = Math.min(99, Math.max(15, Math.floor(relativeSize * 300) + 20));
        const dramaScore = parseFloat(((irregularity * 0.45 + roughness * 0.35 + uniqueness * 0.2)).toFixed(1));

        const cropUrl = await cropImageWithJimp(imageBuffer, xmin, ymin, xmax, ymax, imgWidth, imgHeight, 0.12);

        return {
          id: idx + 1,
          title: `Potato #${idx + 1}`,
          persona: personaObj.title,
          irregularity,
          roughness,
          uniqueness,
          dramaScore,
          malayalamQuote: personaObj.quote,
          box: [Math.floor(xmin), Math.floor(ymin), Math.floor(xmax), Math.floor(ymax)] as [number, number, number, number],
          cropUrl,
        };
      })
    );

    results.sort((a, b) => b.dramaScore - a.dramaScore);
    return NextResponse.json({ potatoes: results });

  } catch (error: any) {
    console.error('Error in analyze-potatoes route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze potato vision', details: error.message },
      { status: 500 }
    );
  }
}
