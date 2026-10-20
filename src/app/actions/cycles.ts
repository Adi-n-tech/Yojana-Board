"use server";

import { Cycle } from '@/types';
import { cycleRepository } from '@/repositories/cycle-repository';

export async function fetchCyclesAction() {
  try {
    return await cycleRepository.getCycles();
  } catch (error) {
    console.error("Failed to fetch cycles:", error);
    return [];
  }
}

export async function createCycleAction(cycle: Cycle) {
  try {
    return await cycleRepository.createCycle(cycle);
  } catch (error) {
    console.error("Failed to create cycle:", error);
    throw new Error('Failed to create cycle');
  }
}
