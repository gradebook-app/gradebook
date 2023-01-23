//
//  RNTStorageCalculator.h
//  Gradebook
//
//  Created by Mahit Mehta on 9/30/22.
//

@interface RNTStorageCalculator : NSObject

- (NSNumber *) getSizeByKey: (NSString * ) key;

- (NSNumber *) getSizeByBatch: (NSArray<NSString *> *) keys;

- (NSNumber *) getAbsoluteCacheSize; 

@end
