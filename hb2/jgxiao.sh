updateProject() {
  projectPath=$1
  projectBuildPath=$2
  projectBuildStaticPath=$3

  echo 更新源码 &&
    cd ${projectPath} &&
    git pull &&
    echo 编译项目 &&
    npm run build &&
    echo 更新打包项目 &&
    git pull &&
    cd ${projectBuildPath} &&
    echo 删除旧文件 &&
    rm -rf ${projectBuildStaticPath} &&
    echo 复制文件 &&
    cp -R ${projectPath}/dist ${projectBuildPath}/${projectBuildStaticPath} &&
    echo 提交git &&
    git add . &&
    git commit -m auto &&
    git push &&
    echo 更新完成
}

# 后台管理所在目录
backProject=/Users/Arthur/Fiberhome/hb-sqi &&
  # 后台打包后的项目所在目录
  backProjectBuild=/Users/Arthur/Fiberhome/official-web-back &&

  # 后台打包后项目的静态文件相对根目录的路径
  backProjectBuildStatic=src/main/resources/static/officialWebBack &&
  updateProject ${backProject} ${backProjectBuild} ${backProjectBuildStatic}

# 官网所在目录
frontProject=/Users/Arthur/Fiberhome/index-web &&
  # 官网打包后的项目所在目录
  frontProjectBuild=/Users/Arthur/Fiberhome/official-web-front &&
  frontProjectBuildStatic=src/main/resources/static/officialWebFront &&
  updateProject ${frontProject} ${frontProjectBuild} ${frontProjectBuildStatic}
