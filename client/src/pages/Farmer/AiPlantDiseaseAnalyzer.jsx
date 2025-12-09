
import React, { useState, useEffect } from "react";
import {
  Loader,
  AlertTriangle,
  CheckCircle,
  Leaf,
  AlertCircle,
  Info,
  Zap,
  Shield,
  UploadCloud,
  Globe,
  XCircle, // Used for the clear button for better visibility
  TrendingUp, // For confidence/severity indicator
  Heart, // For healthy status
} from "lucide-react";
import { analyzePlantImage } from "../../apis/aiApi/";

// --- CONSTANTS AND HELPERS (Keep outside the component for clean UI logic) ---
const STORAGE_KEY = "aiPlantAnalyzerState";
const MAX_FILE_SIZE_MB = 5;

// Utility to determine color based on confidence/severity
const getIndicatorStyle = (value, type = "confidence") => {
  let colorClass;
  let label;

  if (type === "confidence") {
    if (value >= 80) {
      colorClass = "bg-green-500 text-white";
      label = "High Confidence";
    } else if (value >= 50) {
      colorClass = "bg-yellow-500 text-white";
      label = "Medium Confidence";
    } else {
      colorClass = "bg-red-500 text-white";
      label = "Low Confidence";
    }
  } else if (type === "severity") {
    const severityMap = {
      low: { class: "bg-green-500 text-white", label: "Low" },
      medium: { class: "bg-yellow-500 text-white", label: "Medium" },
      high: { class: "bg-red-500 text-white", label: "High" },
    };
    const style = severityMap[value?.toLowerCase()] || {
      class: "bg-gray-400 text-white",
      label: "N/A",
    };
    colorClass = style.class;
    label = style.label;
  }

  return { colorClass, label };
};

// --- MAIN COMPONENT ---
const AiPlantDiseaseAnalyzer = () => {
  // States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [translatedResult, setTranslatedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [language, setLanguage] = useState("en");

  // Logic Hooks (keeping existing business logic as requested)
  // [Load state from storage on mount] - useEffect 1
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { imageB64, result, tab, lang, translated } = JSON.parse(saved);
        setImageBase64(imageB64);
        setSelectedImage(
          imageB64 ? `data:image/jpeg;base64,${imageB64}` : null
        );
        setAnalysisResult(result);
        setTranslatedResult(translated);
        if (tab) setActiveTab(tab);
        if (lang) setLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to load saved state:", err);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // [Save state to storage] - useEffect 2
  useEffect(() => {
    try {
      const stateToSave = {
        imageB64: imageBase64,
        result: analysisResult,
        tab: activeTab,
        lang: language,
        translated: translatedResult,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error("Failed to save state:", err);
    }
  }, [imageBase64, analysisResult, activeTab, language, translatedResult]);

  // [Cleanup] - useEffect 3
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // Helper to fetch translation (Keeping existing logic for translation)
  const fetchTranslation = async (text) => {
    if (!text || typeof text !== "string") return text;
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=gu&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0].map((item) => item[0]).join("");
      }
      return text;
    } catch (err) {
      console.error("Translation API fetch error:", err);
      return text;
    }
  };

  const translateToGujarati = async (englishResult) => {
    if (!englishResult) return;

    setIsTranslating(true);
    setError(null);

    try {
      // 1. Translate simple strings
      const tSummary = await fetchTranslation(englishResult.summary);
      const tDisease = await fetchTranslation(englishResult.disease);
      const tPlantType = await fetchTranslation(englishResult.plantType);

      // 2. Helper to translate arrays
      const translateArray = async (arr) => {
        if (!arr || arr.length === 0) return [];
        const joined = arr.join(" ||| ");
        const translated = await fetchTranslation(joined);
        return translated.split("|||").map((s) => s.trim());
      };

      // 3. Translate the lists in parallel
      const [tSymptoms, tCauses, tSuggestions, tPrevention] = await Promise.all(
        [
          translateArray(englishResult.symptoms),
          translateArray(englishResult.causes),
          translateArray(englishResult.suggestions),
          translateArray(englishResult.prevention),
        ]
      );

      // 4. Construct final object
      const finalTranslation = {
        ...englishResult,
        plantType: tPlantType,
        disease: tDisease,
        summary: tSummary,
        symptoms: tSymptoms,
        causes: tCauses,
        suggestions: tSuggestions,
        prevention: tPrevention,
        healthy: englishResult.healthy,
        confidence: englishResult.confidence,
        severity: englishResult.severity,
      };

      setTranslatedResult(finalTranslation);
      setLanguage("gu");
    } catch (err) {
      console.error("Translation logic failed:", err);
      setError("ભાષાંતર નિષ્ફળ (Translation failed). Showing English results.");
      setLanguage("en");
    } finally {
      setIsTranslating(false);
    }
  };

  const getCurrentResult = () =>
    language === "gu" && translatedResult ? translatedResult : analysisResult;

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`Image size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setImageBase64(base64);
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setAnalysisResult(null);
      setTranslatedResult(null);
      setLanguage("en");
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange({ target: { files: [file] } });
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzePlantImage(imageFile);
      setAnalysisResult(result);
      setTranslatedResult(null);
      setLanguage("en");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    if (selectedImage && selectedImage.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageBase64(null);
    setImageFile(null);
    setAnalysisResult(null);
    setTranslatedResult(null);
    setError(null);
    setActiveTab("summary");
    setLanguage("en");
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const currentResult = getCurrentResult();
  const isResultsReady = !!currentResult;

  const langOptions = [
    { key: "en", label: "English", icon: <Globe className="w-4 h-4" /> },
    {
      key: "gu",
      label: "ગુજરાતી",
      icon: <Globe className="w-4 h-4 text-green-700" />,
    },
  ];

  const { colorClass: confidenceColorClass, label: confidenceLabel } =
    isResultsReady
      ? getIndicatorStyle(currentResult.confidence, "confidence")
      : {};

  const { colorClass: severityColorClass, label: severityLabel } =
    isResultsReady ? getIndicatorStyle(currentResult.severity, "severity") : {};

  return (
    // Mobile-first: Full height, constrained width for readability
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header for Branding/Context */}
      <header className="bg-green-700 shadow-lg p-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-300" />
            AI Plant Doctor
          </h1>
          {/* Language Toggle in Header when results are ready */}
          {isResultsReady && (
            <div className="flex space-x-1 p-1 bg-green-600 rounded-lg shadow-inner">
              {langOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    if (
                      opt.key === "gu" &&
                      language === "en" &&
                      analysisResult
                    ) {
                      translateToGujarati(analysisResult);
                    } else if (opt.key === "en") {
                      setLanguage("en");
                    }
                  }}
                  disabled={
                    isTranslating || (opt.key === "gu" && !analysisResult)
                  }
                  className={`flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    language === opt.key
                      ? "bg-white text-green-700 shadow-md"
                      : "text-green-200 hover:text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {opt.label}
                  {isTranslating && opt.key === "gu" && (
                    <Loader className="ml-1 w-3 h-3 animate-spin" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Main Description */}
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            🌾 <b>AI Plant Doctor : </b> Instant Crop Care: Upload a clear image of your plant's leaf
            or crop for expert AI analysis and practical advice in seconds.
          </p>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl space-y-8 border border-gray-100">
            {/* Upload Section */}
            <section className="w-full">
              <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                <UploadCloud className="w-5 h-5 mr-2 text-green-600" />
                {selectedImage ? "Review Image" : "Upload Plant Photo"}
              </h2>

              <div
                className={`relative w-full h-56 sm:h-72 border-2 rounded-xl overflow-hidden transition-all duration-300 group ${
                  selectedImage
                    ? "border-green-500 bg-white"
                    : "border-dashed border-green-300 bg-green-50 hover:bg-green-100 cursor-pointer"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {/* Image & Placeholder */}
                {!selectedImage ? (
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors duration-200"
                  >
                    <UploadCloud className="w-10 h-10 sm:w-14 sm:h-14 text-green-600 mb-3" />
                    <p className="mb-1 text-sm sm:text-base text-gray-700 font-semibold">
                      Tap or Drag Photo Here
                    </p>
                    <p className="text-xs text-gray-500">
                      Best results from clear, close-up images. (Max.{" "}
                      {MAX_FILE_SIZE_MB}MB)
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                ) : (
                  <>
                    <img
                      src={selectedImage}
                      alt="Selected plant for analysis"
                      className="w-full h-full object-contain p-2"
                    />
                  </>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Loader className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-green-600 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">Analyzing...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedImage && (
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={analyzeImage}
                    disabled={isLoading || isResultsReady}
                    className="flex-1 max-w-sm mx-auto bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg text-base"
                  >
                    <Zap className="mr-2 w-5 h-5" />
                    {isResultsReady ? "Analysis Complete" : "Start AI Analysis"}
                  </button>
                  <button
                    onClick={clearAnalysis}
                    className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base flex items-center justify-center"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Clear Image
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-xl flex items-start text-red-700 text-sm animate-fade-in">
                  <AlertTriangle className="mr-2 w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Analysis Results Section */}
            <section className="w-full space-y-6 pt-4 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-700 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Analysis Results
              </h2>

              {/* Empty State */}
              {!isResultsReady ? (
                <div className="p-10 flex flex-col items-center justify-center text-gray-400 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                  <Leaf className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-green-300/70" />
                  <p className="text-base sm:text-lg font-medium text-gray-600">
                    Your results will appear here.
                  </p>
                  <p className="text-sm mt-1 text-gray-500">
                    Upload an image and press 'Start AI Analysis'.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* High-Level Summary Card */}
                  <div
                    className={`p-5 rounded-xl shadow-lg border-l-4 ${
                      currentResult.healthy
                        ? "border-green-600 bg-green-50"
                        : "border-red-600 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-extrabold text-gray-800 flex items-center">
                        {currentResult.healthy ? (
                          <Heart className="mr-2 w-6 h-6 text-green-600" />
                        ) : (
                          <AlertTriangle className="mr-2 w-6 h-6 text-red-600" />
                        )}
                        {currentResult.disease ||
                          (language === "en"
                            ? "Healthy Plant"
                            : "તંદુરસ્ત છોડ")}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${confidenceColorClass} shadow-sm hidden sm:inline-flex`}
                      >
                        {confidenceLabel}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold">
                        {language === "en" ? "Plant Type:" : "છોડનો પ્રકાર:"}
                      </span>{" "}
                      {currentResult.plantType ||
                        (language === "en" ? "Unspecified" : "અનિશ્ચિત")}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs mt-3">
                      <span className="font-medium text-gray-700 flex items-center">
                        {language === "en" ? "Confidence:" : "વિશ્વાસ:"}
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-white ${confidenceColorClass}`}
                        >
                          {currentResult.confidence}%
                        </span>
                      </span>
                      <span className="font-medium text-gray-700 flex items-center">
                        {language === "en" ? "Severity:" : "ગંભીરતા:"}
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${severityColorClass}`}
                        >
                          {severityLabel}
                        </span>
                      </span>
                    </div>

                    {/* Progress Bar with Confidence */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ease-out ${confidenceColorClass}`}
                        style={{ width: `${currentResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Tabs for Detailed Information */}
                  <div className="bg-white rounded-xl shadow-inner p-1 border border-gray-100">
                    <nav className="flex overflow-x-auto space-x-1">
                      {[
                        {
                          key: "summary",
                          icon: Info,
                          label: language === "en" ? "Summary" : "સારાંશ",
                        },
                        {
                          key: "details",
                          icon: AlertCircle,
                          label:
                            language === "en"
                              ? "Symptoms & Causes"
                              : "લક્ષણો અને કારણો",
                        },
                        {
                          key: "advice",
                          icon: Zap,
                          label:
                            language === "en"
                              ? "Suggestions & Prevention"
                              : "સૂચનો અને નિવારણ",
                        },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`shrink-0 py-2 px-4 rounded-lg font-semibold text-sm flex items-center whitespace-nowrap transition-all duration-200 ${
                              activeTab === tab.key
                                ? "bg-green-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-2 shrink-0" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Tab Content Area */}
                  <div className="pt-2">
                    {activeTab === "summary" && (
                      <div className="p-5 bg-white rounded-xl shadow-lg border border-gray-100 text-sm">
                        <h4 className="font-bold text-base mb-2 text-gray-800 flex items-center">
                          <Info className="mr-2 w-4 h-4 text-green-600" />
                          {language === "en" ? "Overview" : "ઝાંખી"}
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {currentResult.summary}
                        </p>
                      </div>
                    )}

                    {activeTab === "details" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Symptoms */}
                        <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 text-sm shadow-md">
                          <h4 className="font-semibold text-base mb-3 text-blue-800 flex items-center">
                            <AlertCircle className="mr-2 w-5 h-5" />
                            {language === "en" ? "Symptoms" : "લક્ષણો"}
                          </h4>
                          <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                            {currentResult.symptoms?.length > 0 ? (
                              currentResult.symptoms.map((symptom, i) => (
                                <li key={i} className="text-sm">
                                  {symptom}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">
                                {language === "en"
                                  ? "No specific symptoms listed."
                                  : "કોઈ ચોક્કસ લક્ષણો સૂચિબદ્ધ નથી."}
                              </li>
                            )}
                          </ul>
                        </div>
                        {/* Causes */}
                        <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200 text-sm shadow-md">
                          <h4 className="font-semibold text-base mb-3 text-yellow-800 flex items-center">
                            <AlertTriangle className="mr-2 w-5 h-5" />
                            {language === "en" ? "Causes" : "કારણો"}
                          </h4>
                          <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                            {currentResult.causes?.length > 0 ? (
                              currentResult.causes.map((cause, i) => (
                                <li key={i} className="text-sm">
                                  {cause}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">
                                {language === "en"
                                  ? "No specific causes listed."
                                  : "કોઈ ચોક્કસ કારણો સૂચિબદ્ધ નથી."}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "advice" && (
                      <div className="space-y-4">
                        {/* Suggestions */}
                        <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-sm shadow-md">
                          <h4 className="font-semibold text-base mb-3 text-green-800 flex items-center">
                            <CheckCircle className="mr-2 w-5 h-5" />
                            {language === "en"
                              ? "Treatment Suggestions"
                              : "ઉપચાર સૂચનો"}
                          </h4>
                          <ol className="space-y-2 text-gray-700 list-decimal list-inside ml-4">
                            {currentResult.suggestions?.length > 0 ? (
                              currentResult.suggestions.map((suggestion, i) => (
                                <li key={i} className="text-sm font-medium">
                                  {suggestion}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">
                                {language === "en"
                                  ? "No specific suggestions provided."
                                  : "કોઈ ચોક્કસ સૂચનો પૂરા પાડવામાં આવ્યાં નથી."}
                              </li>
                            )}
                          </ol>
                        </div>
                        {/* Prevention */}
                        <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200 text-sm shadow-md">
                          <h4 className="font-semibold text-base mb-3 text-indigo-800 flex items-center">
                            <Shield className="mr-2 w-5 h-5" />
                            {language === "en"
                              ? "Prevention Tips"
                              : "નિવારણ ટિપ્સ"}
                          </h4>
                          <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                            {currentResult.prevention?.length > 0 ? (
                              currentResult.prevention.map((tip, i) => (
                                <li key={i} className="text-sm">
                                  {tip}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500">
                                {language === "en"
                                  ? "No specific prevention tips listed."
                                  : "કોઈ ચોક્કસ નિવારણ ટિપ્સ સૂચિબદ્ધ નથી."}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer / Disclaimer */}
      <footer className="p-4 bg-gray-100 border-t border-gray-200 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto">
          <p>
            **Disclaimer:** This tool provides AI-driven preliminary analysis.
            Always consult a local agricultural expert for critical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AiPlantDiseaseAnalyzer;