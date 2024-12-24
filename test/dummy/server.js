import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import unbuilt from "../../index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "crypto";

const app = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const { 
  config, 
  stylesheetLinkTag, 
  javascriptIncludeTag, 
  imageUrl 
} = unbuilt;

// Helper function to generate ETag from file content
const generateETag = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return crypto
      .createHash('md5')
      .update(`${stats.size}-${stats.mtime.getTime()}`)
      .digest('hex');
  } catch (err) {
    return crypto.randomBytes(16).toString('hex');
  }
};

// Middleware to handle conditional requests
const conditionalGet = (req, res, next) => {
  const ifNoneMatch = req.headers['if-none-match'];
  const ifModifiedSince = req.headers['if-modified-since'];

  if (!res.locals.etag) {
    return next();
  }

  if (ifNoneMatch && ifNoneMatch === res.locals.etag) {
    return res.status(304).end();
  }

  if (ifModifiedSince && new Date(ifModifiedSince) >= res.locals.lastModified) {
    return res.status(304).end();
  }

  next();
};

app.use(express.static(path.join(currentDir, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    const etag = generateETag(filePath);
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

app.get("/", conditionalGet, (req, res) => {
  const pageData = {
    pageTitle: "Welcome to My App"
  };

  const contentHash = crypto
    .createHash('md5')
    .update(JSON.stringify(pageData))
    .digest('hex');
  
  res.locals.etag = `"${contentHash}"`;
  res.locals.lastModified = new Date();

  res.setHeader('ETag', res.locals.etag);
  res.setHeader('Last-Modified', res.locals.lastModified.toUTCString());
  res.setHeader('Cache-Control', 'private, must-revalidate');

  res.render("pages/index", pageData);
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});
