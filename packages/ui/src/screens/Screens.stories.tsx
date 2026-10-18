import type { Meta, StoryObj } from "@storybook/react";
import {
  EnergyExplainScreen, EnergyIndicatorScreen, HomeScreen, LoginScreen, MenuScreen, NameScreen,
  LocationPermissionScreen, PlacesScreen, RenameDialogScreen, SAMPLE, ScenePickerScreen, ScheduleScreen,
  SchedulePromptScreen, SettingsScreen, SleepScreen, WaterScreen, WeightScreen,
} from "./Screens";

const meta: Meta = {
  title: "Screens/Flow",
  parameters: { layout: "centered", docs: { description: { component: "Dwanaście ekranów złożonych z tych samych komponentów." } } },
};
export default meta;
type Story = StoryObj;
const d = SAMPLE;

export const S01_Login: Story = { name: "01 Login", render: () => <LoginScreen /> };
export const S02_Name: Story = { name: "02 Imię", render: () => <NameScreen name={d.name} /> };
export const S03_EnergyExplain: Story = { name: "03 Energia", render: () => <EnergyExplainScreen name={d.name} /> };
export const S04_Indicator: Story = { name: "04 Wskaźnik energii", render: () => <EnergyIndicatorScreen name={d.name} energyPercent={d.energyPercent} /> };
export const S05_Sleep: Story = { name: "05 Sen", render: () => <SleepScreen name={d.name} sleepStart={d.sleepStart} sleepEnd={d.sleepEnd} /> };
export const S06_Weight: Story = { name: "06 Waga", render: () => <WeightScreen name={d.name} weightKg={d.weightKg} goalMl={d.goalMl} /> };
export const S07_Home: Story = { name: "07 Home", render: () => <HomeScreen {...d} /> };
export const S08_Menu: Story = { name: "08 Menu", render: () => <MenuScreen name={d.name} energyPercent={d.energyPercent} /> };
export const S09_Water: Story = { name: "09 Woda", render: () => <WaterScreen {...d} /> };
export const S10_Tired: Story = { name: "10 Zmęczony", render: () => <HomeScreen {...d} energyPercent={0} state="tired" /> };
export const S11_Sleeping: Story = { name: "11 Śpi", render: () => <HomeScreen {...d} energyPercent={100} state="sleeping" /> };
export const S12_Rename: Story = { name: "12 Zmiana imienia", render: () => <RenameDialogScreen {...d} /> };
export const S13_Settings: Story = { name: "13 Ustawienia", render: () => <SettingsScreen {...d} /> };
export const WaterDrinking: Story = { name: "Woda – po dodaniu szklanki", render: () => <WaterScreen {...d} drinking /> };

export const S14_HomeOffice: Story = { name: "14 Home – biuro", render: () => <HomeScreen {...d} scene="office" /> };
export const S15_HomeLunch: Story = { name: "15 Home – lunch", render: () => <HomeScreen {...d} scene="lunch" state="happy" /> };
export const S16_HomeHome: Story = { name: "16 Home – dom", render: () => <HomeScreen {...d} scene="home" /> };
export const S17_HomeHomeNight: Story = { name: "17 Dom – noc", render: () => <HomeScreen {...d} scene="home" state="sleeping" energyPercent={100} /> };
export const S18_ScenePicker: Story = { name: "18 Wybór sceny", render: () => <ScenePickerScreen name={d.name} energyPercent={d.energyPercent} /> };
export const S19_Places: Story = { name: "19 Miejsca", render: () => <PlacesScreen energyPercent={d.energyPercent} /> };
export const S20_LocationPermission: Story = { name: "20 Zgoda na lokalizację", render: () => <LocationPermissionScreen name={d.name} /> };
export const S21_Schedule: Story = { name: "21 Plan dnia", render: () => <ScheduleScreen energyPercent={d.energyPercent} /> };
export const S22_SchedulePrompt: Story = { name: "22 Pytanie o plan", render: () => <SchedulePromptScreen name={d.name} energyPercent={d.energyPercent} /> };
