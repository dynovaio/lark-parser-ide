<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LarkParserLogo from '$lib/components/Icon/LarkParserLogoSquare.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Logo Square',
    component: LarkParserLogo,
    tags: ['autodocs'],
    argTypes: {
      color: {
        control: { type: 'color' }
      },
      size: {
        control: { type: 'range', min: 24, max: 128, step: 8 }
      }
    }
  });
</script>

<Story name="Size 24 and color black" args={{ size: 24, color: 'black' }} />

<Story name="Size 32 and color blue" args={{ size: 32, color: 'blue' }} />

<Story name="Size 64 and color green" args={{ size: 64, color: 'green' }} />

<Story name="Size 128 and color red" args={{ size: 128, color: 'red' }} />
