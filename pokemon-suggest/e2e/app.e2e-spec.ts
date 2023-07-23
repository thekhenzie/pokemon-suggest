import { PokemonSuggestPage } from './app.po';

describe('pokemon-suggest App', function() {
  let page: PokemonSuggestPage;

  beforeEach(() => {
    page = new PokemonSuggestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
