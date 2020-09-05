import React from 'react';
import modalManager from "./ModalManager";

const ModalContainer = () => {
  const [isVisible, setVisible] = React.useState(false);
  const CurrentModal = modalManager.getCurrentModal();
  const currentModalProps = modalManager.getCurrentModalProps();

  React.useEffect(() => {
    modalManager.subscribeToVisibleStateChange(setVisible);
    return () => {
      modalManager.unsubscribeFromVisibleStateChange(setVisible);
      modalManager.cleanup();
    }
  }, []);
  
  // Compatibility with react-native-modal
  if (modalManager.getOption('reactNativeModalCompatibleMode')) {
    currentModalProps.isVisible = isVisible;
    currentModalProps.onModalHide = () => modalManager.handleModalDismiss();
  } else {
    currentModalProps.visible = isVisible;
    currentModalProps.onDismiss = () => modalManager.handleModalDismiss();
  }
  
  return (
    <CurrentModal {...currentModalProps} />
  );
};

export default ModalContainer;