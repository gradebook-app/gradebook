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
  let userId: String
  let pass: String
}

struct GradesResponse {
  
}

/* func getGrades() {
  let url = URL(string: "https://gradebook-web-api.herokuapp.com")!

  let task = URLSession.shared.dataTask(with: url) { data, response, error in
    if let data = data {
        
    } else if let error = error {
      // Error in fetching data
    }
  }
}*/


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
          if let credentialsRaw = userDefaults!.value(forKey: "credentials") as? String {
              let decoder = JSONDecoder()
              let credentials = credentialsRaw.data(using: .utf8)
            
              if let parsedData = try? decoder.decode(WidgetData.self, from: credentials!) {
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
                let entry = SimpleEntry(date: nextRefresh, configuration: configuration, displayText: "Grades Widget")
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
      let columns: [GridItem] = [
          GridItem(.flexible()),
          GridItem(.flexible())
      ]
      
      LinearGradient(gradient: Gradient(colors: [.black, .black]), startPoint: .top, endPoint: .bottom)
        .edgesIgnoringSafeArea(.vertical)
        .overlay(
          VStack {
           LazyVGrid(
            columns: columns,
            alignment: .leading,
            spacing: 8,
            pinnedViews: [.sectionHeaders, .sectionFooters]
           ) {
             ForEach(0..<8) { i in
               Text("English: 96%")
                 .font(.system(size: 15, weight: .bold, design: .default)).padding(5)
             }
           }
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
        .supportedFamilies([ WidgetFamily.systemMedium ])
    }
}

struct GradesWidget_Previews: PreviewProvider {
    static var previews: some View {
      GradesWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), displayText: "Demo 1"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
