@echo off
title Lets Resize it in Batch!
magick.exe mogrify -resize 500x500 -path ../../public/images *.png *.jpg
echo Welcome!
pause