import React from "react";
import { NativeModules } from "react-native";

const { RNTStorageCalculator } = NativeModules;

export default class StorageCalculator {
    public static async getSizeByKey(key: string): Promise<number> {
        return await RNTStorageCalculator.getSizeByKey(key);
    }

    public static async getSizeByBatch(batch: string[]) : Promise<number> {
        return await RNTStorageCalculator.getSizeByBatch(batch);
    }

    public static async getAbsoluteCacheSize() : Promise<number> {
        return await RNTStorageCalculator.getAbsoluteCacheSize();
    }
};  