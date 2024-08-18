#!/bin/bash

# Input video
INPUT_VIDEO=red-bull

# Input video file
INPUT_VIDEO_PATH="static/videos/$INPUT_VIDEO-raw.mp4"

# Convert to MP4 (H.264)
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libx264 -crf 18 -b:v 0 -preset slower -c:a aac "static/videos/$INPUT_VIDEO-h264.mp4"
echo "Conversion complete: $INPUT_VIDEO to H.264 MP4"

# # Convert to WebM
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libvpx-vp9 -crf 20 -b:v 0 -c:a libvorbis "static/videos/$INPUT_VIDEO-vp9.webm"
echo "Conversion complete: $INPUT_VIDEO to WebM"

# # Convert to AV1
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libsvtav1 -crf 24 -b:v 0 -preset 7 -c:a libopus "static/videos/$INPUT_VIDEO-av1.webm"
echo "Conversion complete: $INPUT_VIDEO to AV1"
