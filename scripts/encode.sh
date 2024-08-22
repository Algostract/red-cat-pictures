#!/bin/bash

# Input video
INPUT_VIDEO=peanut-bar

# Input video file
INPUT_VIDEO_PATH="static/videos/$INPUT_VIDEO-raw.mp4"

# # Convert to MP4 (H.264 / AVC)
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libx264 -crf 23 -b:v 0 -preset slower -c:a aac "static/videos/$INPUT_VIDEO-avc.mp4"
echo "Conversion complete: $INPUT_VIDEO to AVC"

# # Convert to WebM (VP9)
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libvpx-vp9 -crf 31 -b:v 0 -deadline best -c:a libvorbis "static/videos/$INPUT_VIDEO-vp9.webm"
echo "Conversion complete: $INPUT_VIDEO to VP9"

# # Convert to MP4 (H.265 / HEVC)
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libx265 -crf 28 -preset slow -c:a aac "static/videos/$INPUT_VIDEO-hevc.mp4"
echo "Conversion complete: $INPUT_VIDEO to HEVC"

# # Convert to WebM (AV1)
ffmpeg -i "$INPUT_VIDEO_PATH" -c:v libsvtav1 -crf 30 -b:v 0 -preset 2 -c:a libopus "static/videos/$INPUT_VIDEO-av1.webm"
echo "Conversion complete: $INPUT_VIDEO to AV1"