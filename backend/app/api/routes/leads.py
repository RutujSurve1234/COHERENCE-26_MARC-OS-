from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

router = APIRouter()

@router.post("/upload-leads")
async def upload_leads(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        df = df.fillna("")
        leads = df.to_dict(orient="records")

        return {
            "total_leads": len(leads),
            "leads": leads  # <--- Changed from "sample: leads[:3]" to return ALL leads
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))