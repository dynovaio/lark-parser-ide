import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
  it('should render without throwing', async () => {
    expect(() => render(Page)).not.toThrow();
  });
});
