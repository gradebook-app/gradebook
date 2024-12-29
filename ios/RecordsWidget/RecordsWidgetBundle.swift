//
//  RecordsWidgetBundle.swift
//  RecordsWidget
//
//  Created by Mahit Mehta on 12/29/24.
//

import WidgetKit
import SwiftUI

@main
struct RecordsWidgetBundle: WidgetBundle {
    var body: some Widget {
        RecordsWidget()
        RecordsWidgetControl()
        RecordsWidgetLiveActivity()
    }
}
