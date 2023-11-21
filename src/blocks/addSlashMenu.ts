import { Modal } from "@ijstech/components";
import { ScomEditorSlashMenu, createModal, getModalContainer } from "../components/index";
import { BlockNoteEditor, CustomSlashMenuState } from "../global/index";

export const addSlashMenu = (editor: BlockNoteEditor) => {
  let modal: Modal;
  let menuElm: ScomEditorSlashMenu;
  let popupPlacement = 'bottomLeft';

  async function updateItems(items: any[], onClick: (item: any) => void, selected: number, referencePos: any) {
    const { bottom = 0 } = referencePos;
    const maxHeight = window.innerHeight - bottom;
    menuElm = await ScomEditorSlashMenu.create({
      items: [...items],
      selectedIndex: selected,
      overflow: {y: 'auto'},
      maxHeight: maxHeight <= 110 ? 200 : maxHeight,
      display: 'block',
      onItemClicked: (item: any) => {
        onClick(item);
        modal.visible = false;
      }
    });
    if (window.innerHeight - bottom <= 110) {
      popupPlacement = 'topLeft';
    }
    modal.item = menuElm;
  }

  editor.slashMenu.onUpdate(async (slashMenuState: CustomSlashMenuState) => {
    const selectedBlocks = editor.getSelection()?.blocks || [editor.getTextCursorPosition().block];
    const block = selectedBlocks[0];
    const blockID = block?.id;
    if (!modal) {
      modal = await createModal({
        id: 'pnlSlashMenu',
        popupPlacement,
        padding: {left: 0, top: 0, right: 0, bottom: 0},
        zIndex: 3000
      })
      modal.position = "fixed";
      getModalContainer().appendChild(modal);
    }

    if (slashMenuState.show) {
      updateItems(
        slashMenuState.filteredItems,
        editor.slashMenu.itemCallback,
        slashMenuState.keyboardHoveredItemIndex,
        slashMenuState.referencePos
      );
      if (blockID) {
        const blockEl = editor.domElement.querySelector(`[data-id="${blockID}"]`);
        if (blockEl) {
          modal.linkTo = blockEl;
          modal.visible = true;
        }
      } else {
        modal.visible = false;
      }
    }
  });
};
