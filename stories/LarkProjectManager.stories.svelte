<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProjectManager from '$lib/components/Ide/Project/Manager.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';

  const { Story } = defineMeta({
    title: 'Lark IDE/Project/Manager',
    component: ProjectManager,
    tags: ['autodocs'],
    argTypes: {
      onSelectProject: { action: 'onSelectProject' },
      onCreateProject: { action: 'onCreateProject' },
      onDownloadProject: { action: 'onDownloadProject' },
      onEditProject: { action: 'onEditProject' },
      onDeleteProject: { action: 'onDeleteProject' }
    }
  });
</script>

<script>
  const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);
  setIdeContext(mockIdeState);
</script>

<Story name="Default">
  <div style="width: 100%; padding: 20px;">
    <ProjectManager
      onSelectProject={() => console.log('Select project')}
      onCreateProject={() => console.log('Create project')}
      onDownloadProject={() => console.log('Download project')}
      onEditProject={() => console.log('Edit project')}
      onDeleteProject={() => console.log('Delete project')}
    />
  </div>
</Story>
