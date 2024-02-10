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

struct GradesQuery: Codable {
  let grades: String
}

struct GradesQueryBody: Codable {
  let email: String
  let pass: String
}

class WebService {
  static func getGrades(completion:@escaping (GradesQuery?, Error?) -> Void) {
   // let productionURL = "https://genesus.api.mahitm.com"
    let url = URL(string: "http://localhost:5001/grades/widgetGrades")!
    let session = URLSession.shared
    
    var request = URLRequest(url: url, cachePolicy: URLRequest.CachePolicy.reloadIgnoringLocalCacheData)
    request.httpMethod = "POST"


    let body = GradesQueryBody(email: "10024503@sbstudents.org", pass: "Rent#5$7")
    let bodySerialized = try? JSONEncoder().encode(body)
    
    let task = session.uploadTask(with: request, from:bodySerialized) {(data, response, error) in
      if (error != nil) {
        return
      }
      
      guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode) else { return }

      if let parsedQuery = try? JSONDecoder().decode(GradesQuery.self, from: data!) {
        print(parsedQuery)
        completion(parsedQuery, nil)
      }
      
    }
    task.resume()
  }
}


struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: ConfigurationIntent(), displayText: "Coming Soon")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), configuration: configuration, displayText: "Coming Soon")
        completion(entry)
        print("completion")
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
      print("hello 2kjkjk")

        let entryDate = Date()
        let userDefaults = UserDefaults.init(suiteName: "group.com.Gradebook.Gradebook")
        print("heljjlo 1")
        if userDefaults != nil {
          if let credentialsRaw = userDefaults!.value(forKey: "credentials") as? String {
              let decoder = JSONDecoder()
              let credentials = credentialsRaw.data(using: .utf8)
              print("hello")
          
              if let parsedData = try? decoder.decode(WidgetData.self, from: credentials!) {
                print(parsedData.pass) 
                print(parsedData.userId)
                WebService.getGrades {(grades, error) in
                    let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
                    let entry = SimpleEntry(date: nextRefresh, configuration: configuration, displayText: "Grades Widget")
                    let timeline = Timeline(entries: [entry], policy: .atEnd)
                    
                    completion(timeline)
                }
              } else {
                  print("Could not parse data!!!!!!!!!!!!!")
              }
          } else {
              let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
            let entry = SimpleEntry(date: nextRefresh, configuration: configuration, displayText: "Coming Soon")
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            print("hello 4")

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
      
      LinearGradient(gradient: Gradient(colors: [.black, .black
                                                ]), startPoint: .top, endPoint: .bottom)
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
               Text("English: 89%")
                 .font(.system(size: 15, weight: .bold, design: .default)).foregroundColor(Color.white).padding(5)
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
        .configurationDisplayName("Grades Widget")
        .description("Display Student Grades from Genesis Parent Portal.")
        .supportedFamilies([ WidgetFamily.systemMedium ])
    }
}

struct GradesWidget_Previews: PreviewProvider {
    static var previews: some View {
      GradesWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), displayText: "Demo 1"))
        .environment(\.sizeCategory, .medium)
        .previewDevice("iPhone 13 Pro")
        .previewContext(WidgetPreviewContext(family: .systemMedium))
    }
}
