/**
 * Warning Signs Page
 *
 * Displays common vehicle warning lights, their meanings, and recommended actions.
 * Uses a responsive grid layout with shadcn UI Card components.
 *
 * @module Pages/WarningSigns
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

/**
 * Interface for warning sign data
 */
interface WarningSign {
  name: string;
  symbol: string;
  meaning: string;
  action: string;
  imageFile: string;
}

/**
 * Warning signs data
 */
const warningSignsData: WarningSign[] = [
  {
    name: "Engine Warning Light",
    symbol: "An outline of an engine",
    meaning:
      "Indicates issues such as low oil pressure, overheating, or malfunctioning sensors",
    action: "Address promptly to prevent potential engine damage",
    imageFile: "Check-engine-warning.jpg",
  },
  {
    name: "Tire Pressure Monitoring System (TPMS) Light",
    symbol: "An exclamation mark inside a horseshoe shape",
    meaning: "Signals that one or more tires have low air pressure",
    action: "Check and adjust tire pressures to the recommended levels",
    imageFile: "Tyre-pressure-warning.jpg",
  },
  {
    name: "Battery Warning Light",
    symbol: "A battery icon",
    meaning:
      "Indicates problems with the vehicle's charging system, such as a faulty alternator or battery issues",
    action: "Inspect the charging system to avoid unexpected breakdowns",
    imageFile: "Battery-warning.jpg",
  },
  {
    name: "Anti-lock Braking System (ABS) Warning Light",
    symbol: "The letters 'ABS' inside a circle",
    meaning:
      "Alerts to potential issues with the ABS, which prevents wheel lock-up during braking",
    action: "Have the braking system checked to ensure safety",
    imageFile: "ABS-warning.jpg",
  },
  {
    name: "Oil Pressure Warning Light",
    symbol: "An oil can icon",
    meaning: "Indicates low oil pressure, which can lead to engine damage",
    action: "Check oil levels and pressure immediately",
    imageFile: "Oil-pressure-warning.jpg",
  },
  {
    name: "Engine Temperature Warning Light",
    symbol: "A thermometer submerged in liquid",
    meaning: "Signals that the engine is overheating",
    action:
      "Stop the vehicle safely and allow the engine to cool before checking coolant levels",
    imageFile: "Engine-temperature-warning.jpg",
  },
  {
    name: "Brake Warning Light",
    symbol: "An exclamation mark inside a circle or the word 'BRAKE'",
    meaning:
      "Indicates issues with the braking system or that the parking brake is engaged",
    action:
      "Ensure the parking brake is released; if the light remains on, inspect the braking system",
    imageFile: "Brake-warning.jpg",
  },
  {
    name: "Transmission Warning Light",
    symbol: "A gear or thermometer icon",
    meaning: "Alerts to transmission overheating or other transmission issues",
    action:
      "Check transmission fluid levels and consult a technician if necessary",
    imageFile: "Transmission-warning.jpg",
  },
  {
    name: "Airbag Warning Light",
    symbol: "A seated figure with a circle (representing an airbag)",
    meaning: "Indicates a problem with the airbag system",
    action:
      "Have the airbag system inspected to ensure it functions correctly in an accident",
    imageFile: "Aribag-warning.jpg",
  },
  {
    name: "Pre-Collision and Lane Departure Warning Lights",
    symbol: "Icons representing a vehicle with lines or exclamation marks",
    meaning:
      "Alerts to malfunctions in advanced driver-assistance systems (ADAS) like pre-collision or lane departure systems",
    action: "Have the ADAS checked to maintain safety features",
    imageFile: "Lane-departure-warning.jpg",
  },
];

/**
 * Warning Signs Page Component
 */
export default function WarningSigns() {
  return (
    <main className="flex flex-col flex-grow w-full items-center bg-gray-50">
      <div className="container px-4 pt-14 pb-24 max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold text-slate-800">
              Vehicle Warning Signs
            </h1>
          </div>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Understanding dashboard warning lights can help you identify and
            address vehicle issues before they become serious problems. Below is
            a guide to common warning indicators you might see in your vehicle.
          </p>
        </div>

        {/* Warning Signs Grid */}
        <div className="space-y-6">
          {warningSignsData.map((sign, index) => (
            <Card
              key={index}
              className="overflow-hidden border-slate-200 transition-all duration-200 hover:scale-[1.025] hover:shadow-md"
            >
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
                {/* Warning Sign Image */}
                <div className="md:col-span-3 flex items-center justify-center p-6 bg-slate-50">
                  <img
                    src={`/${sign.imageFile}`}
                    alt={sign.name}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  />
                </div>

                {/* Warning Sign Content */}
                <div className="md:col-span-9">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800">
                      {sign.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc ml-4 text-slate-600">
                      <li>
                        <span className="font-medium">Symbol:</span>{" "}
                        {sign.symbol}
                      </li>
                      <li>
                        <span className="font-medium">Meaning:</span>{" "}
                        {sign.meaning}
                      </li>
                      <li>
                        <span className="font-medium">Action:</span>{" "}
                        {sign.action}
                      </li>
                    </ul>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
