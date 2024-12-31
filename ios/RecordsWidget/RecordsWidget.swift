//
//  RecordsWidget.swift
//  RecordsWidget
//
//  Created by Mahit Mehta on 12/28/24.
//

import WidgetKit
import SwiftUI

struct Grade: Decodable {
  var percentage: Double
  var letter: String
  var projected: Double
}

struct WidgetClass: Decodable {
  var name: String
  var grade: Grade
}

struct WidgetContent: Decodable {
  var unweightedGPA: Double
  var weightedGPA: Double
  var classes: [WidgetClass]
}

struct WidgetContentBody: Encodable {
  let email: String
  let password: String
  let token: String
}

struct APIConfig {
    static let baseURL: String = {
        #if DEBUG
        return "http://localhost:8000"
        #else
        return "https://api.records.mahitm.com"
        #endif
    }()
}

func getWidgetContent(token: String, email: String, password: String) async throws -> WidgetContent {
  let url = URL(string: "\(APIConfig.baseURL)/grades/widget")!
    
  let requestBody = WidgetContentBody(email: email, password: password, token: token)
    
  var request = URLRequest(url: url)
  request.httpMethod = "POST"
  request.setValue("application/json", forHTTPHeaderField: "Content-Type")
  request.httpBody = try JSONEncoder().encode(requestBody)

  let (data, response) = try await URLSession.shared.data(for: request)
  
  guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
      throw URLError(.badServerResponse)
  }
  
  let widgetContentResponse = try JSONDecoder().decode(WidgetContent.self, from: data)
  
  return widgetContentResponse
}

func getGenesisAuthToken(genesisURL: String, email: String, password: String) async throws -> String {
    guard let url = URL(string: genesisURL) else {
      throw URLError(.badURL)
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
  
    guard let httpResponse = response as? HTTPURLResponse else {
        throw URLError(.badServerResponse)
    }

    let cookies = HTTPCookie.cookies(withResponseHeaderFields: httpResponse.allHeaderFields as! [String: String], for: httpResponse.url!)
    
    if cookies.count == 0 {
      if let cookies = HTTPCookieStorage.shared.cookies {
          if let jsessionCookie = cookies.first(where: { $0.name == "JSESSIONID" }) {
              print("Found cached JSESSIONID Cookie")
              return jsessionCookie.value
          }
      }
    }
  
    if let jsessionCookie = cookies.first(where: { $0.name == "JSESSIONID" }){
        return jsessionCookie.value
    }
     
    print("JSESSIONID Cookie not found.")
    throw URLError(.badServerResponse)
}

struct CredentialsWidgetData: Decodable {
  var email: String
  var password: String
  var schoolDistrict: String
  var genesisURL: String
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(), content: WidgetContent(unweightedGPA: 0, weightedGPA: 0, classes: []))
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: configuration, content: WidgetContent(unweightedGPA: 3.93, weightedGPA: 4.32, classes: [
        WidgetClass(
          name: "Academic English I",
          grade: Grade(percentage: 98, letter: "A+", projected: 0)
        ),
        WidgetClass(
          name: "AP Physics A",
          grade: Grade(percentage: 79, letter: "C+", projected: 0)
        ),
        WidgetClass(
          name: "Computer Science",
          grade: Grade(percentage: 100, letter: "A+", projected: 0)
        ),
        WidgetClass(
          name: "Physical Education",
          grade: Grade(percentage: 83, letter: "B", projected: 0)
        )
      ]))
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
              let content = try await getWidgetContent(token: jsessionId, email: email, password: password)
              
              let nextRefresh = Calendar.current.date(byAdding: .minute, value: 5, to: entryDate)!
              let entry = SimpleEntry(date: nextRefresh, configuration: configuration, content: content)
              return Timeline(entries: [entry],  policy: .after(Date().addingTimeInterval(900)))
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
      let entry = SimpleEntry(date: nextRefresh, configuration: configuration, content: WidgetContent(unweightedGPA: 0, weightedGPA: 0, classes: []))
      return Timeline(entries: [entry], policy: .atEnd)
    }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationAppIntent
  let content: WidgetContent
}

public extension Color {
  static let brandBrown = Color(red: 42 / 255.0, green: 24 / 255.0, blue: 24 / 255.0)
  static let brandDarkBrown = Color(red: 29 / 255.0, green: 16 / 255.0, blue: 16 / 255.0)
  static let brandLightBrown = Color(red: 86 / 255.0, green: 45 / 255.0, blue: 45 / 255.0)
  static let brandFunkyBlue = Color(red: 88 / 255.0, green: 175 / 255.0, blue: 194 / 255.0)
  static let brandFunkyPurple = Color(red: 166 / 255.0, green: 101 / 255.0, blue: 193 / 255.0)
}

struct RecordsWidgetEntryView : View {
    var entry: Provider.Entry

    let columns = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]

    var body: some View {
      ZStack {
        Color.brandBrown
        Spacer()
        VStack(spacing: 0) {
          HStack {
            HStack(spacing: 20) {
              VStack {
                Text("UW")
                  .font(.custom("Jersey15-Regular", size: 18))
                  .foregroundColor(Color.brandFunkyPurple)
                Text("\(String(format: "%.02f", entry.content.unweightedGPA))")
                  .font(.custom("Jersey15-Regular", size: 40))
                  .foregroundColor(Color.white)
              }
              VStack {
                Text("WE")
                  .font(.custom("Jersey15-Regular", size: 18))
                  .foregroundColor(Color.brandFunkyBlue)
                Text("\(String(format: "%.02f", entry.content.weightedGPA))")
                  .font(.custom("Jersey15-Regular", size: 40))
                  .foregroundColor(Color.white)
              }
            }
            Spacer()
            Image("logo")
              .resizable()
              .scaledToFit()
              .frame(width: 60, height: 60)
          }
          .padding(.leading, 10)
          .padding(.trailing, 5)
          .padding(.bottom, 3)
          .frame(maxHeight: .infinity, alignment: .center)
          LazyVGrid(columns: columns, spacing: 5) {
            ForEach(entry.content.classes, id: \.self.name) { item in
              HStack {
                Text(item.name)
                  .font(.custom("Jersey15-Regular", size: 16))
                  .foregroundColor(.white)
                  .lineLimit(1)
                  .truncationMode(.tail)
                Spacer()
                Text("\(String(format: "%.0f", item.grade.percentage))%")
                  .font(.custom("Jersey15-Regular", size: 16))
                  .foregroundColor(.white)
                  .lineLimit(1)
                  .truncationMode(.tail)
              }
              .padding(.horizontal, 7)
              .padding(.vertical, 10)
              .background(Color.brandLightBrown)
              .frame(maxWidth: .infinity)
              .border(Color.brandDarkBrown, width: 3)
            }
          }
        }
        .padding(7)
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
  SimpleEntry(date: .now, configuration: .smiley, content: WidgetContent(unweightedGPA: 3.93, weightedGPA: 4.32, classes: [
    WidgetClass(
      name: "Academic English I",
      grade: Grade(percentage: 98, letter: "A+", projected: 0)
    ),
    WidgetClass(
      name: "AP Physics A",
      grade: Grade(percentage: 79, letter: "C+", projected: 0)
    ),
    WidgetClass(
      name: "Computer Science",
      grade: Grade(percentage: 100, letter: "A+", projected: 0)
    ),
    WidgetClass(
      name: "Physical Education",
      grade: Grade(percentage: 83, letter: "B", projected: 0)
    )
  ]))
}
