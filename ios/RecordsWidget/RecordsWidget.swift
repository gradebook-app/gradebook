//
//  RecordsWidget.swift
//  RecordsWidget
//
//  Created by Mahit Mehta on 12/28/24.
//

import WidgetKit
import SwiftUI

func getGenesisAuthToken(genesisURL: String, email: String, password: String) async throws -> String {
    guard let url = URL(string: genesisURL) else {
      throw URLError(.badURL)
    }
  
    if let cookies = HTTPCookieStorage.shared.cookies {
        if let jsessionCookie = cookies.first(where: { $0.name == "JSESSIONID" }) {
            print("Found cached JSESSIONID Cookie")
            return jsessionCookie.value
        } else {
            print("JSESSIONID Cookie not found.")
        }
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    
    request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
    // Make this dynamic, apparently necessary for retrieving a valid JSESSIONID
    request.setValue("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", forHTTPHeaderField: "User-Agent")
    
    let bodyString = "j_username=\(email)&j_password=\(password)"
    guard let bodyData = bodyString.data(using: .utf8)  else {
      throw URLError(.badURL)
    }
    request.httpBody = bodyData
  
    let (_, response) = try await URLSession.shared.data(for: request)
  
     // Check if the response is valid
     guard let httpResponse = response as? HTTPURLResponse else {
         throw URLError(.badServerResponse)
     }
     
     // Extract cookies from the response headers
    let cookies = HTTPCookie.cookies(withResponseHeaderFields: httpResponse.allHeaderFields as! [String: String], for: httpResponse.url!)
    
    if cookies.count == 0 {
      let waitTime = 2
      print("Rate limit exceeded. Retrying in \(waitTime) seconds...")
      try await Task.sleep(nanoseconds: UInt64(waitTime * 1_000_000_000))
      
      return try await getGenesisAuthToken(genesisURL: genesisURL, email: email, password: password)
    }
  
    // Find JSESSIONID cookie
    if let jsessionCookie = cookies.first(where: { $0.name == "JSESSIONID" }){
        return jsessionCookie.value // Return the JSESSIONID value
    }
     
    throw URLError(.cannotParseResponse)
}

struct CredentialsWidgetData: Decodable {
  var email: String
  var password: String
  var schoolDistrict: String
  var genesisURL: String
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(), text: "example@mahitm.com")
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: configuration, text: "snapshot@mahitm.com")
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let userDefaults = UserDefaults.init(suiteName: "group.records_widget")
      
      let entryDate = Date()
      if userDefaults != nil {
        if let savedData = userDefaults!.value(forKey: "credentials") as? String {
          let decoder = JSONDecoder()
          let data = savedData.data(using: .utf8)
          if let parsedData = try? decoder.decode(CredentialsWidgetData.self, from: data!) {
            
            let email = parsedData.email
            let password = parsedData.password;
            let genesisURL = parsedData.genesisURL;
            
            do {
              let jsessionId = try await getGenesisAuthToken(genesisURL: genesisURL, email: email, password: password)
              print(jsessionId)
              let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
              let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: jsessionId)
              return Timeline(entries: [entry],  policy: .after(Date().addingTimeInterval(3600)))
            } catch {
               print("Error occurred during login request: \(error.localizedDescription)")
               print("Failed to get genesis auth token")
            }
          } else {
            print("Could not parse data")
          }
        }
        print("No credentials found")
      }
      
      let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
      let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "No data set")
      return Timeline(entries: [entry], policy: .atEnd)
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let text: String
}

public extension Color {
  static let brandBrown = Color(red: 42 / 255.0, green: 24 / 255.0, blue: 24 / 255.0)
  static let brandDarkBrown = Color(red: 29 / 255.0, green: 16 / 255.0, blue: 16 / 255.0)
}

struct RecordsWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
      ZStack {
        Color.brandBrown // Change to your desired background color
        VStack {
          Text(entry.text)
          Text(entry.date, style: .time)
            .foregroundColor(.white)
        }// Adjust text color for contrast
      }
      .containerShape(RoundedRectangle(cornerRadius: 21)) // Ensure the sh
                .overlay( // Adding a custom border
                    RoundedRectangle(cornerRadius: 21)
                        .stroke(Color.brandDarkBrown, lineWidth: 7) // Custom border color and width
                )
                .cornerRadius(21)
    }
}

struct RecordsWidget: Widget {
    let kind: String = "RecordsWidget"

    var body: some WidgetConfiguration {
      AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
        RecordsWidgetEntryView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
      }.contentMarginsDisabledIfAvailable()
    }
}

extension WidgetConfiguration
{
    func contentMarginsDisabledIfAvailable() -> some WidgetConfiguration
    {
        if #available(iOSApplicationExtension 17.0, *)
        {
            return self.contentMarginsDisabled()
        }
        else
        {
            return self
        }
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemMedium) {
    RecordsWidget()
} timeline: {
  SimpleEntry(date: .now, configuration: .smiley, text: "preview@mahitm.com")
}
