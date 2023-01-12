

#import "UMPushModule.h"
#import "RNUMConfigure.h"


@implementation UMPushModule


RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(getDeviceToken:(RCTResponseSenderBlock)callback)
{
  //um推送devicktoken，传给js
  NSString *tokens = [RNUMConfigure getDevicetoken];
  callback(@[tokens]);
  
}


@end
