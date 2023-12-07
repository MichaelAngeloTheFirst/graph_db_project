import { useContextMenu } from '../hooks/useContextMenu';

import styles from '../styles/ContextMenu.module.css';
import AddNodeDialog from './AddPlayerDialog'


const ContextMenu = () => {
  const { anchorPoint, isShown } = useContextMenu();

  if (!isShown) {
    return null;
  }

  return (

    <div className={styles.ContextMenu}
      style={{ top: anchorPoint.y, left: anchorPoint.x }}
    >
        <AddNodeDialog/>
    </div>
    
  );
};

export { ContextMenu };