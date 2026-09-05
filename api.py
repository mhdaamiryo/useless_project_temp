import io
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import uvicorn
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a lightweight pretrained YOLO segmentation model
# It will automatically download yolov8n-seg.pt if not present
model = YOLO('yolov8n-seg.pt')

@app.post("/detect")
async def detect_potatoes(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Run YOLO inference
    results = model(img)
    
    potatoes = []
    
    for r in results:
        boxes = r.boxes
            
        for i, box in enumerate(boxes):
            # Extract bounding box [x1, y1, x2, y2]
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = xyxy
            
            # Use class confidence and dimensions as a mock for texture/irregularity since 
            # we are replacing the mock data with actual bounding box driven metrics.
            conf = float(box.conf[0])
            width = x2 - x1
            height = y2 - y1
            area = width * height
            
            # Simple heuristics for "drama" based on actual vision output
            irregularity = min(99, max(10, int((abs(width - height) / max(width, height)) * 100)))
            roughness = int(conf * 100) # Mocking roughness using confidence
            uniqueness = int((area / (img.width * img.height)) * 100) + 50
            uniqueness = min(99, uniqueness)
            
            potatoes.append({
                "id": i + 1,
                "box": [int(x1), int(y1), int(width), int(height)],
                "confidence": conf,
                "irregularity": irregularity,
                "roughness": roughness,
                "uniqueness": uniqueness
            })
            
    # Sort potatoes by size/drama roughly
    potatoes.sort(key=lambda p: p["irregularity"] + p["roughness"], reverse=True)
    
    return {"potatoes": potatoes}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
