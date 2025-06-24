<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LarkParserIcon from '$lib/components/Icon/LarkParserIcon.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Icon',
    component: LarkParserIcon,
    tags: ['autodocs'],
    argTypes: {
      color: {
        control: { type: 'color', default: 'black' },
        description: 'Icon color'
      },
      size: {
        description: 'Icon size in pixels',
        control: { type: 'range', min: 16, max: 128, step: 8, default: 24 }
      }
    }
  });
</script>

<Story name="Size 16 and color black" args={{ size: 16, color: 'black' }} />

<Story name="Size 24 and color red" args={{ size: 24, color: 'red' }} />

<Story name="Size 32 and color blue" args={{ size: 32, color: 'blue' }} />

<Story name="Size 64 and color green" args={{ size: 64, color: 'green' }} />
