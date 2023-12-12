import { BlockNoteEditor, CustomSideMenuState } from "../global/index";
import { ScomEditorSideMenu, getModalContainer } from "../components/index";

export const addSideMenu = (editor: BlockNoteEditor) => {
  let sideMenu: ScomEditorSideMenu;

  editor.sideMenu.onUpdate(async (sideMenuState: CustomSideMenuState) => {
    if (!sideMenu) {
      sideMenu = await ScomEditorSideMenu.create({
        block: sideMenuState.block,
        editor: editor,
        position: 'fixed',
        visible: false
      })
      getModalContainer().appendChild(sideMenu);
    }

    const isFocused = editor.domElement.classList.contains('ProseMirror-focused');

    if (sideMenuState.show) {
      if (sideMenu.isShowing) editor.sideMenu.freezeMenu();
      else editor.sideMenu.unfreezeMenu();
      sideMenu.block = sideMenuState.block;
      sideMenu.visible = isFocused;
    }

    const blockEl = sideMenuState?.block?.id && editor.domElement.querySelector(`[data-id="${sideMenuState.block.id}"]`) as HTMLElement;
    if (blockEl) {
      sideMenu.style.top = `${ sideMenuState.referencePos.y + blockEl.offsetHeight / 2 - sideMenu.offsetHeight / 2 }px`;
      sideMenu.style.left = `${sideMenuState.referencePos.x - sideMenu.offsetWidth}px`;
    } else {
      sideMenu.visible = false;
    }
  });
};
