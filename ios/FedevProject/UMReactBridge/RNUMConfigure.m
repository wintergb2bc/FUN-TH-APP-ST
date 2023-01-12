//
//  RNUMConfigure.m
//  UMComponent
//
//  Created by wyq.Cloudayc on 14/09/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNUMConfigure.h"


static NSString* UMPushdeviceToken = @"deviceTokens";

@implementation RNUMConfigure

+ (void)initWithAppkey:(NSString *)appkey channel:(NSString *)channel
{
  SEL sel = NSSelectorFromString(@"setWraperType:wrapperVersion:");
  if ([UMConfigure respondsToSelector:sel]) {
    [UMConfigure performSelector:sel withObject:@"react-native" withObject:@"2.0"];
  }
  [UMConfigure initWithAppkey:appkey channel:channel];
}

+(void)setDevicetoken:(NSString *)str {
  if (str != nil) {
    UMPushdeviceToken = str;
  }
}

+(NSString *) getDevicetoken{
  return UMPushdeviceToken;
}


@end
