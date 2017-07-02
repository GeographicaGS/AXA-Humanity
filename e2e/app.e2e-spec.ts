import { HumanityPage } from './app.po';

describe('humanity App', () => {
  let page: HumanityPage;

  beforeEach(() => {
    page = new HumanityPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
