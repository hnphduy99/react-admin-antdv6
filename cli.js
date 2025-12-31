import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as changeCase from "change-case";

const argv = yargs(hideBin(process.argv)).parse();
const actionName = argv._[0];
const dirName = argv._[1];
let moduleName = argv._[2];

if (!actionName) {
  console.log("Chua dung cu phap > node cli.js add <dir-name> <module-name>");
  process.exit(1);
}

if (!dirName) {
  console.log(`Chua dung cu phap > node cli.js ${actionName} <dir-name> <module-name>`);
  process.exit(1);
}

const genName = (name = "") => {
  const pascalCaseName = changeCase.pascalCase(name);
  const camelCaseName = changeCase.camelCase(name);
  const kebabCaseName = changeCase.kebabCase(name);
  const constantCaseName = changeCase.constantCase(name);
  const snakeCaseName = changeCase.snakeCase(name);

  return {
    pascalCaseName,
    camelCaseName,
    kebabCaseName,
    constantCaseName,
    snakeCaseName
  };
};

const addNewModule = () => {
  const newModuleName = moduleName ? moduleName : dirName;
  const { pascalCaseName, camelCaseName, kebabCaseName, constantCaseName, snakeCaseName } = genName(newModuleName);

  const moduleFolder = `./src/pages/${camelCaseName}`;

  fs.mkdirSync(moduleFolder, { recursive: true });
  fs.readdirSync("./templates").forEach((fileName) => {
    let newName = "";
    if (/Columns/.test(fileName)) {
      newName = fileName.replace(".tpl", ".tsx").replace("template", camelCaseName);
    } else {
      newName = fileName.replace(".tpl", ".tsx").replace("template", pascalCaseName);
    }
    const oldPath = path.join("./templates", fileName);
    const newPath = path.join(moduleFolder, newName);
    if (fs.existsSync(newPath)) {
      return false;
    }

    try {
      fs.copyFileSync(oldPath, newPath);
      // Update noi dung file
      let fileContent = "";
      fileContent = fs.readFileSync(newPath).toString();
      fileContent = fileContent.replace(/\[component-name\]/g, kebabCaseName);
      fileContent = fileContent.replace(/\[ComponentName\]/g, pascalCaseName);
      fileContent = fileContent.replace(/\[componentName\]/g, camelCaseName);
      fileContent = fileContent.replace(/\[component_name\]/g, snakeCaseName);
      fileContent = fileContent.replace(/\[COMPONENT_NAME\]/g, constantCaseName);
      fs.writeFileSync(newPath, fileContent);
    } catch (error) {
      console.error("@addNewModule > " + error.stack);
    }

    console.log("-> generated: " + newPath);
  });

  try {
    // Thêm cấu hình cho router
    const routerConfigsPath = "./src/routes/index.tsx";
    let routerConfigsContent = fs.readFileSync(routerConfigsPath).toString();
    routerConfigsContent = routerConfigsContent.replace(
      `{/*Declare route here*/}`,
      `<Route
            path="${kebabCaseName}"
            element={
              <PermissionRoute permissionKey="${kebabCaseName}">
                <${pascalCaseName}List />
              </PermissionRoute>
            }
          />` + `\n          {/*Declare route here*/}`
    );
    routerConfigsContent = routerConfigsContent.replace(
      `/*import-component-here*/`,
      moduleName
        ? `const ${pascalCaseName}Page = lazy(() => import("@/pages/${camelCaseName}/${kebabCaseName}/${kebabCaseName}"));`
        : `const ${pascalCaseName}Page = lazy(() => import("@/pages/${camelCaseName}/${pascalCaseName}List"));` +
            `\n/*import-component-here*/`
    );
    routerConfigsContent = routerConfigsContent.replace(
      `/*import-component-with-loading-here*/`,
      `const ${pascalCaseName}List = withLoading(${pascalCaseName}Page);` + `\n/*import-component-with-loading-here*/`
    );
    fs.writeFileSync(routerConfigsPath, routerConfigsContent);

    // Thêm cấu hình API Configs
    const apiConfigsPath = "./src/configs/api-config.ts";
    let apiConfigsContent = fs.readFileSync(apiConfigsPath).toString();
    apiConfigsContent = apiConfigsContent.replace(
      `/*new-api-path-here*/`,
      `,${constantCaseName}: '/${kebabCaseName}',` + `\n  /*new-api-path-here*/`
    );
    fs.writeFileSync(apiConfigsPath, apiConfigsContent);

    // Thêm sidebar navigation
    const sidebarnavConfigsPath = "./src/layouts/Main/Sider/SidebarNavigation.tsx";
    let sidebarConfigsContent = fs.readFileSync(sidebarnavConfigsPath).toString();
    sidebarConfigsContent = sidebarConfigsContent.replace(
      `/*new-sidebar-nav-here*/`,
      `{
    key: "${kebabCaseName}",
    permissionKey: "${kebabCaseName}",
    label: "menu.${kebabCaseName}",
    icon: <BlockOutlined />,
    path: "/${kebabCaseName}"
  },` + `\n  /*new-sidebar-nav-here*/`
    );
    fs.writeFileSync(sidebarnavConfigsPath, sidebarConfigsContent);
  } catch (error) {
    console.error("@addNewModule > " + error.stack);
  }
};

if (actionName.toUpperCase() === "ADD") {
  addNewModule();
} else {
  console.log("Action khong dung => add");
}
