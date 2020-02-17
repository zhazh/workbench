#/usr/bin/sh
# create debug enviroment for flask
pycmdres=`python --version`
pyver=${pycmdres#*n}
OLD_IFS="$IFS" 
IFS="." 
arr=($pyver) 
IFS="$OLD_IFS" 
# check python verison
if [ ${arr[0]} -lt 3 ];then
	echo "python 3 necessary, please update python before run. break."
else
	echo "python version is "${pyver}
	basedir=$(cd `dirname $0`;pwd)
	pipname="/flask/bin/pip"
	flaskdir="/flask"
	cmdpip=${basedir}${pipname}
	dirflask=${basedir}${flaskdir}
	if [ -d $dirflask ];then
		echo "flask directory exists. break..."
	else
		echo "flask directory not exists.. bulid it."
		python -m venv flask
		${cmdpip} install flask
	fi
fi



