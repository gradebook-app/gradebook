//
//  GradesWidget.swift
//  GradesWidget
//
//  Creat/Users/mahitmehta/Desktop/ReactNative/Gradebook/ios/GradesWidget/GradesWidget.swifted by Mahit Mehta on 11/7/21.
//

import WidgetKit
import SwiftUI
import Intents

struct WidgetData: Decodable {
  let displayText: String
}


struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: ConfigurationIntent(), displayText: "Coming Soon")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), configuration: configuration, displayText: "Coming Soon")
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let entryDate = Date()
        let userDefaults = UserDefaults.init(suiteName: "group.com.Gradebook.Gradebook")
      
        if userDefaults != nil {
          if let grades = userDefaults!.value(forKey: "grades") as? String {
              let decoder = JSONDecoder()
              let data = grades.data(using: .utf8)
            
              if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
                let entry = SimpleEntry(date: nextRefresh, configuration: configuration, displayText: parsedData.displayText)
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  
                  completion(timeline)
              } else {
                  print("Could not parse data")
              }
          } else {
              let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
              let entry = SimpleEntry(date: nextRefresh, configuration: configuration, displayText: "Coming Soon")
              let timeline = Timeline(entries: [entry], policy: .atEnd)
              
              completion(timeline)
            }
        }
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationIntent
    let displayText: String
}

struct GradesWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
      LinearGradient(gradient: Gradient(colors: [.black, .black]), startPoint: .top, endPoint: .bottom)
        .edgesIgnoringSafeArea(.vertical)
        .overlay(
          VStack {
            Text(entry.displayText)
              .bold()
              .foregroundColor(.white)
          }.padding(20)
        )
    }
}

@main
struct GradesWidget: Widget {
    let kind: String = "GradesWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            GradesWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}

struct GradesWidget_Previews: PreviewProvider {
    static var previews: some View {
      GradesWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), displayText: "Demo 1"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
