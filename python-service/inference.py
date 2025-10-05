import os
from flask import Flask, request, jsonify

app = Flask(__name__)

UPLOAD_FOLDER = "./uploads"

@app.route("/infer", methods=["POST"])
def infer():
    try:
        if "video" not in request.files:
            return jsonify({"error": "No video file received"}), 400

        video_file = request.files["video"]
        print(" Received video file:", video_file.filename)

        # Ensure uploads folder exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Save file locally
        video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
        video_file.save(video_path)

        # Dummy response for now
        return jsonify({
            "filename": video_file.filename,
            "saved_to": video_path,
            "message": "Video received successfully (handled by Waitress)"
        })

    except Exception as e:
        print("Python Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    from waitress import serve
    # threads=4 means 4 concurrent requests can be processed
    serve(app, host="0.0.0.0", port=5000, threads=4)
