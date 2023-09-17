import { Drawer } from "@mantine/core";
import { ArmyPropsWithoutSelect } from "../Army";

export interface Props {
  opened: boolean;
  close: () => void;
  armies: ArmyPropsWithoutSelect[][];
}

export const DrawerArmy = ({ opened, close, armies }: Props) => {
  return (
    <Drawer size={600} opened={opened} onClose={close} position="left">
      <div className="army-drawer-list">
        <div style={{ height: "50px", width: "50px" }}></div>
        <div>race</div>
        <div>life</div>
        <div>type</div>
        <div>pos y/x</div>
      </div>
      {armies[0].length > 0 &&
        armies[0].map((item) => {
          return (
            <div className="army-drawer-list">
              <div
                className={`army-${item.race}-${item.type}`}
                style={{ height: "50px", width: "50px" }}
              ></div>
              <div>{item.race}</div>
              <div>{item.life}</div>
              <div>{item.type}</div>
              <div>{item.y}/{item.x}</div>
            </div>
          );
        })}
    </Drawer>
  );
};
