// customization
const chatHeight = 200;
const spacesHeight = 200;
const hideLeft = true;

let leftNavigationElem: HTMLElement|null;
let navigationElemVisibleCssClass: string;
let navigationElemCssClass: string|null;
let chatParentElem: HTMLElement|null, spacesParentElem: HTMLElement|null,
    mailElem: HTMLElement|null;
let chatJscontrollerAttrib: string|null, spacesJscontrollerAttrib: string|null,
    mailJscontrollerAttrib: string|null;
function parentWithClass(element: HTMLElement|null, cssClass: string) {
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
  const navigationParent = leftNavigationElem.parentElement!;
  let maxClasses = null;
  for (const a of navigationParent.children as Iterable<HTMLElement>) {
    if (a === leftNavigationElem) {
      continue;
    }
    if (maxClasses === null || maxClasses.length < a.classList.length) {
      maxClasses = a.classList;
    }
  }
  if (!maxClasses) {
    return false;
  }
  const testElem = document.createElement('div');
  document.body.appendChild(testElem);
  for (const cssClass of maxClasses) {
    testElem.className = cssClass;
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
    testElem.className = navigationElemCssClass + ' ' + cssClass;
    if (getComputedStyle(testElem)['visibility'] !== 'hidden') {
      navigationElemVisibleCssClass = cssClass;
      break;
    }
  }
  testElem.remove();
  if (!navigationElemVisibleCssClass) {
    return false;
  }
  const chatIframe = navigationParent!.querySelector(
                         'iframe#gtn-roster-iframe-id') as HTMLElement;
  const spacesIframe = navigationParent!.querySelector(
                           `iframe[src*='&id=rooms&']`) as HTMLElement;
  if (!chatIframe || !spacesIframe) {
    return false;
  }
  chatParentElem = parentWithClass(chatIframe, navigationElemCssClass);
  spacesParentElem = parentWithClass(spacesIframe, navigationElemCssClass);
  mailElem = leftNavigationElem.nextElementSibling as HTMLElement;
  if (!chatParentElem || !spacesParentElem || !mailElem) {
    return false;
  }
  chatJscontrollerAttrib = chatParentElem.getAttribute('jscontroller');
  spacesJscontrollerAttrib = spacesParentElem.getAttribute('jscontroller');
  mailJscontrollerAttrib = mailElem.getAttribute('jscontroller');
  if (!chatJscontrollerAttrib || !spacesJscontrollerAttrib ||
      !mailJscontrollerAttrib) {
    return false;
  }
  return true;
}
function makeCssOneElem(
    jscontroller: string, bottom: string, height: string, left: string) {
  return `
    .${navigationElemCssClass}[jscontroller=${jscontroller}]:not(.${
      navigationElemVisibleCssClass}) {
        visibility: inherit !important;
        bottom: ${bottom} !important;
        height: ${height} !important;
        width: 256px !important;
        left: ${left} !important;
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

function makeCssMail(paddingBottom: string) {
  return `
    .${navigationElemCssClass}[jscontroller=${mailJscontrollerAttrib}].${
      navigationElemVisibleCssClass} {
        padding-bottom: ${paddingBottom};
    }
    `
}

function makeCssHideLeft() {
  return `[role=navigation] {
    display: none;
  }`;
}

function makeCss() {
  const left = hideLeft ? '0' : '68px';
  return makeCssOneElem(
             chatJscontrollerAttrib!, chatHeight + 'px', spacesHeight + 'px',
             left) +
      makeCssOneElem(
             spacesJscontrollerAttrib!, '0', spacesHeight + 'px', left) +
      makeCssMail((chatHeight + spacesHeight) + 'px') +
      (hideLeft ? makeCssHideLeft() : '');
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

function hideLeftMutationCallback(
    mutationList: MutationRecord[], mutationObserver: MutationObserver) {
  if (mailElem!.classList.contains(navigationElemVisibleCssClass)) {
    return;
  }
  chatParentElem!.classList.remove(navigationElemVisibleCssClass);
  spacesParentElem!.classList.remove(navigationElemVisibleCssClass);
  mailElem!.classList.add(navigationElemVisibleCssClass);
  return;
}

function addMutationCallbacksForHideLeft() {
  const observer = new MutationObserver(hideLeftMutationCallback);
  observer.observe(mailElem!, {attributeFilter: ['class']});
}

function loadHandler() {
  if (!findCssClasses()) {
    console.log('zhuowei-gmail-sidebar-style: can\'t find css classes');
    return;
  }
  makeAndAddCss();
  if (hideLeft) {
    addMutationCallbacksForHideLeft();
  }
}

function mutationCallback(
    mutationRecords: MutationRecord[], mutationObserver: MutationObserver) {
  for (const mutation of mutationRecords) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style' &&
        (mutation.target as HTMLElement).style.display === 'none') {
      mutationObserver.disconnect();
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
  const mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(loadingSplash, {attributeFilter: ['style']});
}
documentLoadHandler();
