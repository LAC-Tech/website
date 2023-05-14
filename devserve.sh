#browser-sync start --port 8888 --no-notify false --proxy "localhost:2015" --files "public/**/*"
ls input/* | entr -c make -B
