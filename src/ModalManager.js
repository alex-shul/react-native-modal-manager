const defaultOptions = {
  strict: false,
  props: null,
  reactNativeModalCompatibleMode: false,
}

const dummy = () => null;

class ModalManager {
  constructor() {
    this.modals = {};
    this.currentModal = null;
    this.queuedModal = null;
    this.options = defaultOptions;
    this.callbacksOnVisibleStateChange = [];
  }
  
  setup(options = {}) {
    this.options = {
      ...this.options,
      ...options
    }
  }
  
  cleanup() {
    this.modals = {}
  }
  
  getOption(key) {
    return this.options[key];
  }
  
  subscribeToVisibleStateChange(callback) {
    this.callbacksOnVisibleStateChange.push(callback);
  }
  
  unsubscribeFromVisibleStateChange(callbackToRemove) {
    const index = this.callbacksOnVisibleStateChange.findIndex(callback => callback === callbackToRemove);
    if (index > -1) {
      this.callbacksOnVisibleStateChange.splice(index, 1);
    } else if (__DEV__ && this.options.strict) {
      // Create new error for stack trace in console
      console.warn(new Error(
        `ModalManager: can't unsubscribe from visible state change - callback not found. (type: ${typeof callback}, dump: ${JSON.stringify(callback)})`
      ));
    }
  }
  
  handleModalDismiss() {
    if (this.queuedModal) {
      this.currentModal = this.queuedModal;
      this.queuedModal = null;
      this.callbacksOnVisibleStateChange.forEach(callback => callback(true));
    } else {
      this.currentModal = null;
    }
  }
  
  getCurrentModal() {
    return (this.currentModal && this.currentModal.component) || dummy;
  }
  
  getCurrentModalProps() {
    return {
      ...this.options.props,
      ...(this.currentModal && this.currentModal.props)
    }
  }
  
  push(modalName, modalComponent) {
    if (__DEV__ && this.modals[modalName]) {
      console.warn(`ModalManager: replacing previous modal with name "${modalName}". Give unique names for modals.`);
    }
    
    this.modals[modalName] = modalComponent;
  }
  
  open(modalName, props = null) {
    if (this.modals[modalName]) {
      const newModal = {
        component: this.modals[modalName],
        name: modalName,
        props: {
          ...props,
          name: modalName
        }
      }
      
      if (!this.currentModal) {
        this.currentModal = newModal;
        this.callbacksOnVisibleStateChange.forEach(callback => callback(true));
      } else {
        this.queuedModal = newModal;
        this.callbacksOnVisibleStateChange.forEach(callback => callback(false));
      }
    } else if (__DEV__) {
      console.warn(`ModalManager: can't open modal with name "${modalName}" - not found.`);
    }
  }
  
  close(modalName = '') {
    if (this.currentModal) {
      if (this.options.strict && this.currentModal.name !== modalName) {
        if (__DEV__) {
          console.warn(`ModalManager: can't close modal with name "${modalName}" - the current opened modal has a different name("${this.currentModal.name}").`);
        }
      } else {
        this.callbacksOnVisibleStateChange.forEach(callback => callback(false));
      }
    } else {
      if (this.options.strict && __DEV__) {
        console.warn(`ModalManager: can't close modal with name "${modalName}" - there are no modals opened.`);
      }
    }
  }
}

const modalManager = new ModalManager();
export default modalManager;