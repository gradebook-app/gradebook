//
//  RNTStorageCalculator.m
//  Gradebook
//
//  Created by Mahit Mehta on 9/30/22.
//

#import <Foundation/Foundation.h>

#import "RNTStorageCalculator.h"

#import <React/RCTUtils.h>

static NSString *const RCTAsyncStorageDirectory = @"RCTAsyncLocalStorage_V1";

@implementation RNTStorageCalculator

// method from https://stackoverflow.com/a/40044672/13949737 and by @Anurag Soni
+ (unsigned long long) getFolderSizeAtFSRef:(NSString *) theFilePath
{
  unsigned long long totalSize = 0;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL  isdirectory;
  NSError *error;

  if ([fileManager fileExistsAtPath:theFilePath])
  {
      NSMutableArray * directoryContents = [[fileManager contentsOfDirectoryAtPath:theFilePath error:&error] mutableCopy];

      for (NSString *fileName in directoryContents)
      {
          if (([fileName rangeOfString:@".DS_Store"].location != NSNotFound) )
              continue;

              NSString *path = [theFilePath stringByAppendingPathComponent:fileName];
              if([fileManager fileExistsAtPath:path isDirectory:&isdirectory] && isdirectory  )
              {
                      totalSize =  totalSize + [self getFolderSizeAtFSRef:path];
              }
              else
              {
                  unsigned long long fileSize = [[fileManager attributesOfItemAtPath:path error:&error] fileSize];
                  totalSize = totalSize + fileSize;
              }
      }
  }
  return totalSize;
}

+ (NSNumber *) getFileSize: (NSString*) filePath {
  NSFileManager *fileManager = [ NSFileManager defaultManager ];
  NSDictionary* fileAttrs = [ fileManager attributesOfItemAtPath:filePath error:nil ];
    
  NSNumber* fileSize = @([ fileAttrs fileSize ]);
  
  return fileSize;
}

+ (NSString *) getStorageFolderAbsolutePath {
  NSString *storagePath = @"";
  storagePath = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES)
    .firstObject;
  storagePath = [ storagePath stringByAppendingPathComponent:[[NSBundle mainBundle] bundleIdentifier]];
  storagePath = [ storagePath stringByAppendingPathComponent:RCTAsyncStorageDirectory];
  return storagePath;
}

+ (NSString *) getFilePathByKey: (NSString*) key {
  NSString *safeFileName = RCTMD5Hash(key);
  return [[ RNTStorageCalculator getStorageFolderAbsolutePath ] stringByAppendingPathComponent:safeFileName ];
}

- (NSNumber *) getAbsoluteCacheSize {
  NSString *storagePath = [ RNTStorageCalculator getStorageFolderAbsolutePath ];
  
  UInt64 fileSize;
  
  fileSize = [ RNTStorageCalculator getFolderSizeAtFSRef : storagePath ];
  
  return @(fileSize);
}

- (NSNumber*) getSizeByBatch:(NSArray<NSString *> *) keys {
  int totalSize = 0;
  
  for (NSString* key in keys) {
    NSString *filePath = [ RNTStorageCalculator getFilePathByKey:key ];
    totalSize = totalSize + [[ RNTStorageCalculator getFileSize:filePath ] intValue];
  }
  
  return @(totalSize);
}

- (NSNumber *) getSizeByKey:(NSString *)key {
  NSString *filePath = [ RNTStorageCalculator getFilePathByKey:key ];
  
  NSNumber* fileSize;
  
  fileSize = [ RNTStorageCalculator getFileSize : filePath ];
  
  return fileSize;
}

@end
