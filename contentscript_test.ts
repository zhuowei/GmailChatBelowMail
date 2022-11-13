import 'jasmine';

const FAKE_GMAIL_HTML = `
<div id="navigation-parent">
  <div role="navigation" id="left-navigation-elem"></div>
  <div id="mail-elem" class="mail-elem navigation-elem navigation-elem-visible"
    jscontroller="mail-jscontroller"></div>
  <div id="chat-elem" class="chat-elem navigation-elem"
    jscontroller="chat-jscontroller">
    <iframe id="gtn-roster-iframe-id"></iframe>
  </div>
  <div id="spaces-elem" class="spaces-elem navigation-elem"
    jscontroller="spaces-jscontroller">
    <iframe src="about:blank?foo=1&id=rooms&bar=2"></iframe>
  </div>
</div>
<style>
.navigation-elem {
  overflow: hidden;
}
.navigation-elem:not(.navigation-elem-visible) {
  visibility: hidden;
}
</style>
`;

const EXPECTED_CSS = `
    .navigation-elem[jscontroller=chat-jscontroller]:not(.navigation-elem-visible) {
        visibility: inherit !important;
        bottom: 200px !important;
        height: 200px !important;
        width: 256px !important;
        left: 0 !important;
    }
    .navigation-elem[jscontroller=chat-jscontroller]:not(.navigation-elem-visible) div:first-child div:first-child div:first-child {
        height: 24px !important;
        margin-top: 8px !important;
        margin-bottom: 0px !important;
    }
    .navigation-elem[jscontroller=chat-jscontroller]:not(.navigation-elem-visible) div:first-child div:first-child div:first-child div[role=button] {
        height: 24px !important;
    }
    
    .navigation-elem[jscontroller=spaces-jscontroller]:not(.navigation-elem-visible) {
        visibility: inherit !important;
        bottom: 0 !important;
        height: 200px !important;
        width: 256px !important;
        left: 0 !important;
    }
    .navigation-elem[jscontroller=spaces-jscontroller]:not(.navigation-elem-visible) div:first-child div:first-child div:first-child {
        height: 24px !important;
        margin-top: 8px !important;
        margin-bottom: 0px !important;
    }
    .navigation-elem[jscontroller=spaces-jscontroller]:not(.navigation-elem-visible) div:first-child div:first-child div:first-child div[role=button] {
        height: 24px !important;
    }
    
    .navigation-elem[jscontroller=mail-jscontroller].navigation-elem-visible {
        padding-bottom: 400px;
    }
    [role=navigation] {
    display: none;
  }`;

describe('GmailChatBelowMail post load', () => {
  let fakeElem: HTMLElement;
  beforeEach(() => {
    const myStyles = document.getElementById('zhuowei-gmail-sidebar-style');
    if (myStyles) {
      myStyles.remove();
    }
    fakeElem = document.createElement('div');
    fakeElem.innerHTML = FAKE_GMAIL_HTML;
    document.body.appendChild(fakeElem);
  });
  afterEach(() => {
    fakeElem.remove();
  });
  it('adds correct CSS', () => {
    loadHandler();

    const addedStyles = document.getElementById('zhuowei-gmail-sidebar-style');
    expect(addedStyles).not.toBeNull();
    expect(addedStyles!.textContent).toBe(EXPECTED_CSS);
  });
});
