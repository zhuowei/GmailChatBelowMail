let leftNavigationElem;
let navigationElemVisibleCssClass;
let navigationElemCssClass;
let navigationElemPopupClass;
let chatJscontrollerAttrib, spacesJscontrollerAttrib, mailJscontrollerAttrib;
let backgroundColor;
let mutationObserver;
function parentWithClass(element, cssClass) {
  while (element && !element.classList.contains(cssClass)) {
    element = element.parentElement;
  }
  return element;
}
function findCssClasses() {
  leftNavigationElem = document.querySelector('[role=navigation]');
  if (!leftNavigationElem) {
    return false;
  }
  const navigationParent = leftNavigationElem.parentElement;
  let maxClasses = null;
  for (const a of navigationParent.children) {
    if (a === leftNavigationElem) {
      continue;
    }
    if (maxClasses === null || maxClasses.length < a.classList.length) {
      maxClasses = a.classList;
    }
  }
  const testElem = document.createElement('div');
  document.body.appendChild(testElem);
  for (const cssClass of maxClasses) {
    testElem.classList = cssClass;
    if (getComputedStyle(testElem)['overflow'] === 'hidden') {
      navigationElemCssClass = cssClass;
      break;
    }
  }
  if (!navigationElemCssClass) {
    testElem.remove();
    return false;
  }
  for (const cssClass of maxClasses) {
    testElem.classList = navigationElemCssClass + ' ' + cssClass;
    if (getComputedStyle(testElem)['visibility'] !== 'hidden') {
      navigationElemVisibleCssClass = cssClass;
      break;
    }
  }
  testElem.remove();
  if (!navigationElemVisibleCssClass) {
    return false;
  }
  let chatIframe =
      navigationParent.querySelector('iframe#gtn-roster-iframe-id');
  let spacesIframe =
      navigationParent.querySelector(`iframe[src*='&id=rooms&']`);
  if (!chatIframe || !spacesIframe) {
    return false;
  }
  const chatParentElem = parentWithClass(chatIframe, navigationElemCssClass);
  const spacesParentElem =
      parentWithClass(spacesIframe, navigationElemCssClass);
  chatJscontrollerAttrib = chatParentElem.getAttribute('jscontroller');
  spacesJscontrollerAttrib = spacesParentElem.getAttribute('jscontroller');
  const mailElem = leftNavigationElem.nextSibling;
  mailJscontrollerAttrib = mailElem.getAttribute('jscontroller');
  if (!chatJscontrollerAttrib || !spacesJscontrollerAttrib) {
    return false;
  }
  return true;
}
function makeCssOneElem(jscontroller, bottom, height) {
  return `
    .${navigationElemCssClass}[jscontroller=${jscontroller}]:not(.${
      navigationElemVisibleCssClass}) {
        visibility: inherit !important;
        bottom: ${bottom} !important;
        height: ${height} !important;
        width: 256px !important;
        left: 68px !important;
    }
    .${navigationElemCssClass}[jscontroller=${jscontroller}]:not(.${
      navigationElemVisibleCssClass}) div:first-child div:first-child div:first-child {
        height: 24px !important;
        margin-top: 8px !important;
        margin-bottom: 0px !important;
    }
    .${navigationElemCssClass}[jscontroller=${jscontroller}]:not(.${
      navigationElemVisibleCssClass}) div:first-child div:first-child div:first-child div[role=button] {
        height: 24px !important;
    }
    `;
}

function makeCssMail(paddingBottom) {
  return `
    .${navigationElemCssClass}[jscontroller=${mailJscontrollerAttrib}].${
      navigationElemVisibleCssClass} {
        padding-bottom: ${paddingBottom};
    }
    `
}

function makeCss() {
  const chatHeight = 200;
  const spacesHeight = 200;
  return makeCssOneElem(
             chatJscontrollerAttrib, chatHeight + 'px', spacesHeight + 'px') +
      makeCssOneElem(spacesJscontrollerAttrib, '0', spacesHeight + 'px') +
      makeCssMail((chatHeight + spacesHeight) + 'px');
}

function makeAndAddCss() {
  const cssText = makeCss();
  const oldElem = document.getElementById('zhuowei-gmail-sidebar-style');
  if (oldElem) {
    oldElem.remove();
  }
  const cssElem = document.createElement('style');
  cssElem.id = 'zhuowei-gmail-sidebar-style';
  cssElem.textContent = cssText;
  document.head.appendChild(cssElem);
}

function loadHandler() {
  if (!findCssClasses()) {
    console.log('zhuowei-gmail-sidebar-style: can\'t find css classes');
    return;
  }
  makeAndAddCss();
}

function mutationCallback(mutationRecords) {
  for (const mutation of mutationRecords) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style' &&
        mutation.target.style.display === 'none') {
      mutationObserver.disconnect();
      mutationObserver = null;
      setTimeout(loadHandler, 0);
      return;
    }
  }
}

function documentLoadHandler() {
  const loadingSplash = document.getElementById('loading');
  if (!loadingSplash) {
    return;
  }
  if (loadingSplash.style.display === 'none') {
    loadHandler();
    return;
  }
  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(loadingSplash, {attributeFilter: ['style']});
}
documentLoadHandler();