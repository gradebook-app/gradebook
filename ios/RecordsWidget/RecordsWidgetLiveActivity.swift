//
//  RecordsWidgetLiveActivity.swift
//  RecordsWidget
//
//  Created by Mahit Mehta on 12/29/24.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct RecordsWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct RecordsWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: RecordsWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension RecordsWidgetAttributes {
    fileprivate static var preview: RecordsWidgetAttributes {
        RecordsWidgetAttributes(name: "World")
    }
}

extension RecordsWidgetAttributes.ContentState {
    fileprivate static var smiley: RecordsWidgetAttributes.ContentState {
        RecordsWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: RecordsWidgetAttributes.ContentState {
         RecordsWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: RecordsWidgetAttributes.preview) {
   RecordsWidgetLiveActivity()
} contentStates: {
    RecordsWidgetAttributes.ContentState.smiley
    RecordsWidgetAttributes.ContentState.starEyes
}
