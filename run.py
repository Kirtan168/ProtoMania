import uvicorn
import sys
import os

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

if __name__ == "__main__":
    print("==================================================================")
    print("PROTOMANIA - AI-Powered Fitness & Budget Platform for Students")
    print("Tagline: Your Body. Your Budget. Your Era.")
    print("Server running at: http://127.0.0.1:8000")
    print("Developer Hub at:  http://127.0.0.1:8000/developers")
    print("API Docs at:        http://127.0.0.1:8000/docs")
    print("==================================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
