import { Prisma } from "@prisma/client";

export function reset() {
  Prisma.raw("DROP TABLE verplaatsing;");
  Prisma.raw("DROP TABLE reiziger;");
  Prisma.raw("DROP TABLE bestemming;");
  Prisma.raw("DROP TABLE vervoersmiddel;");
}
