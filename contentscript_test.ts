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

describe('GmailChatBelowMail post load', () => {
  let fakeElem: HTMLElement;
  beforeEach(() => {
    fakeElem = document.createElement('div');
    fakeElem.innerHTML = FAKE_GMAIL_HTML;
    document.body.appendChild(fakeElem);
  });
  afterEach(() => {
    fakeElem.remove();
  });
  it('finds css classes', () => {
    expect(findCssClasses()).toBe(true);

    expect(leftNavigationElem!.id).toBe('left-navigation-elem');
    expect(navigationElemVisibleCssClass).toBe('navigation-elem-visible');
    expect(navigationElemCssClass).toBe('navigation-elem');
    expect(chatParentElem!.id).toBe('chat-elem');
    expect(spacesParentElem!.id).toBe('spaces-elem');
    expect(mailElem!.id).toBe('mail-elem');
    expect(chatJscontrollerAttrib).toBe('chat-jscontroller');
    expect(spacesJscontrollerAttrib).toBe('spaces-jscontroller');
    expect(mailJscontrollerAttrib).toBe('mail-jscontroller');
  });
});
