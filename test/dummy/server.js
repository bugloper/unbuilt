import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import unbuilt from "../../index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const { 
  config, 
  stylesheetLinkTag, 
  javascriptIncludeTag, 
  imageUrl,
  fingerprint
} = unbuilt;

app.use(express.static(path.join(currentDir, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    const etag = fingerprint(filePath);
    res.setHeader('ETag', `"${etag}"`);
    
    if (filePath.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
  }
}));

app.set("view engine", "ejs");
app.set("views", path.join(currentDir, 'app', 'views'));
app.use(expressEjsLayouts);
app.set("layout", "layouts/application");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use((req, res, next) => {
  res.locals.stylesheetLinkTag = stylesheetLinkTag;
  res.locals.javascriptIncludeTag = javascriptIncludeTag;
  res.locals.imageUrl = imageUrl;
  next();
});

app.get("/", (req, res) => {
  const pageData = {
    pageTitle: "Welcome to My App"
  };
  res.render("pages/index", pageData);
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});
