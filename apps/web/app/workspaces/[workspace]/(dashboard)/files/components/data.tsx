import { EnvironmentVariables } from "database";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export type SecretFiles = Omit<EnvironmentVariables, "updated_at" | "secretId">;

// Function to generate a random name
function generateRandomName() {
  const names = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

// Create dummy array with random names
export const dummyData: SecretFiles[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: index + 1,
    name: generateRandomName(),
    created_at: new Date(),
    variables: `Variables ${index + 1}`,
  })
);

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];
