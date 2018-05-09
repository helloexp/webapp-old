import isClientSideRender from './isClientSideRender.js';

const idGenerationPattern = /[^a-z0-9]+/ig;
let imageUrls = {};

let linkNodeTemplate;

if (isClientSideRender) {
  linkNodeTemplate = document.createElement('link');
  linkNodeTemplate.setAttribute('rel', 'preload');
  linkNodeTemplate.setAttribute('as', 'image');
}

function getLinkId(imageUrl) {
  return imageUrl.replace(idGenerationPattern, '_');
}

function insertPreloadTag(imageUrl) {
  const linkNode = linkNodeTemplate.cloneNode(false);

  linkNode.setAttribute('href', imageUrl);
  linkNode.setAttribute('id', getLinkId(imageUrl));

  document.body.appendChild(linkNode);
}

export function clearPreloadList() {
  imageUrls = {};
}

export function preloadAsset(imageUrl) {
  if (!imageUrls.hasOwnProperty(imageUrl)) {
    imageUrls[imageUrl] = imageUrl;
    if (isClientSideRender) {
      // this setTimeout is NEEDED here to give browser time to add link elements from SSR to document
      setTimeout(() => {
        if (!document.getElementById(getLinkId(imageUrl))) {
          insertPreloadTag(imageUrl);
        }
      }, 300);
    }
  }
}

export function getAssetsToPreload() {
  return Object.keys(imageUrls).map(imageUrl => `<link rel="preload" as="image" href="${imageUrl}" id="${getLinkId(imageUrl)}" >`).join('');
}
