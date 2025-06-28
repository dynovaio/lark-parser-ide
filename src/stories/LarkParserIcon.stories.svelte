<script module>
  import '../app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LarkParserIcon from '$lib/components/Icon/LarkParserIcon.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Icon/LarkParserIcon',
    component: LarkParserIcon,
    tags: ['autodocs'],
    argTypes: {
      size: {
        control: { type: 'range', min: 16, max: 200, step: 4 },
        description: 'Size of the icon'
      },
      color: {
        control: { type: 'color' },
        description: 'Color of the icon'
      },
      weight: {
        control: { type: 'select' },
        options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
        description: 'Weight of the icon'
      },
      mirrored: {
        control: { type: 'boolean' },
        description: 'Whether the icon should be mirrored'
      }
    }
  });
</script>

<Story name="Default">
  <div style="padding: 20px; display: flex; align-items: center; gap: 16px;">
    <LarkParserIcon size={48} color="currentColor" weight="regular" mirrored={false} />
    <span>Lark Parser Icon</span>
  </div>
</Story>

<Story name="Different Sizes">
  <div style="padding: 20px; display: flex; align-items: center; gap: 16px;">
    <LarkParserIcon size={16} />
    <LarkParserIcon size={24} />
    <LarkParserIcon size={32} />
    <LarkParserIcon size={48} />
    <LarkParserIcon size={64} />
  </div>
</Story>

<Story name="Different Colors">
  <div style="padding: 20px; display: flex; align-items: center; gap: 16px; background: #f5f5f5;">
    <LarkParserIcon size={48} color="#000000" />
    <LarkParserIcon size={48} color="#FF0000" />
    <LarkParserIcon size={48} color="#00FF00" />
    <LarkParserIcon size={48} color="#0000FF" />
    <LarkParserIcon size={48} color="#FF6B35" />
  </div>
</Story>
