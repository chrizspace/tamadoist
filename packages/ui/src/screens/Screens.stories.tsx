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
export const S07b_EnergyInfo: Story = { name: "07b Home – po kliknięciu energii", render: () => <HomeScreen {...d} toast={`Energii starczy do ${d.energyUntil}`} /> };
export const S10_Tired: Story = { name: "10 Zmęczony", render: () => <HomeScreen {...d} energyPercent={0} state="tired" /> };
export const S11_Sleeping: Story = { name: "11 Śpi", render: () => <HomeScreen {...d} energyPercent={50} state="sleeping" location="home.bedroom" period="night" /> };
export const S12_Rename: Story = { name: "12 Zmiana imienia", render: () => <RenameDialogScreen {...d} /> };
export const S13_Settings: Story = { name: "13 Ustawienia", render: () => <SettingsScreen {...d} /> };
export const WaterDrinking: Story = { name: "Woda – po dodaniu szklanki", render: () => <WaterScreen {...d} drinking /> };

export const S14_OpenSpace: Story = { name: "14 Home – open space", render: () => <HomeScreen {...d} location="work.openspace" period="noon" /> };
export const S15_WorkKitchen: Story = { name: "15 Home – kuchnia w pracy", render: () => <HomeScreen {...d} location="work.kitchen" period="noon" state="happy" /> };
export const S16_HomeOffice: Story = { name: "16 Home – biuro domowe", render: () => <HomeScreen {...d} location="home.office" period="evening" /> };
export const S17_Gym: Story = { name: "17 Home – siłownia", render: () => <HomeScreen {...d} location="recreation.gym" period="evening" /> };
export const S18_Pool: Story = { name: "18 Home – basen", render: () => <HomeScreen {...d} location="recreation.pool" period="morning" /> };
export const S19_Bike: Story = { name: "19 Home – rower", render: () => <HomeScreen {...d} location="recreation.bike" period="noon" /> };
export const S20_ParkNight: Story = { name: "20 Park – noc", render: () => <HomeScreen {...d} location="recreation.park" period="night" /> };
export const S21_ScenePicker: Story = { name: "21 Wybór sceny", render: () => <ScenePickerScreen name={d.name} energyPercent={d.energyPercent} /> };
export const S22_Places: Story = { name: "22 Miejsca", render: () => <PlacesScreen energyPercent={d.energyPercent} /> };
export const S23_LocationPermission: Story = { name: "23 Zgoda na lokalizację", render: () => <LocationPermissionScreen name={d.name} /> };
export const S24_Schedule: Story = { name: "24 Plan dnia", render: () => <ScheduleScreen energyPercent={d.energyPercent} /> };
export const S25_SchedulePrompt: Story = { name: "25 Pytanie o plan", render: () => <SchedulePromptScreen name={d.name} energyPercent={d.energyPercent} /> };
