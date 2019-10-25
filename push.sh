if [ -z "$1" ]; then
        echo "Usage: ./push.sh \"<commit message>\""
        exit
fi

git add .
git commit -m "$1"
git push origin master
